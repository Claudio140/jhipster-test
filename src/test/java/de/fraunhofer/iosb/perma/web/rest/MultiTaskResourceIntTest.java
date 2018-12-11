package de.fraunhofer.iosb.perma.web.rest;

import de.fraunhofer.iosb.perma.PermaApp;

import de.fraunhofer.iosb.perma.domain.MultiTask;
import de.fraunhofer.iosb.perma.repository.MultiTaskRepository;
import de.fraunhofer.iosb.perma.repository.search.MultiTaskSearchRepository;
import de.fraunhofer.iosb.perma.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;


import static de.fraunhofer.iosb.perma.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MultiTaskResource REST controller.
 *
 * @see MultiTaskResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PermaApp.class)
public class MultiTaskResourceIntTest {

    private static final Instant DEFAULT_CREATION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TASKING_PARAMETER = "AAAAAAAAAA";
    private static final String UPDATED_TASKING_PARAMETER = "BBBBBBBBBB";

    @Autowired
    private MultiTaskRepository multiTaskRepository;

    /**
     * This repository is mocked in the de.fraunhofer.iosb.perma.repository.search test package.
     *
     * @see de.fraunhofer.iosb.perma.repository.search.MultiTaskSearchRepositoryMockConfiguration
     */
    @Autowired
    private MultiTaskSearchRepository mockMultiTaskSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMultiTaskMockMvc;

    private MultiTask multiTask;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MultiTaskResource multiTaskResource = new MultiTaskResource(multiTaskRepository, mockMultiTaskSearchRepository);
        this.restMultiTaskMockMvc = MockMvcBuilders.standaloneSetup(multiTaskResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MultiTask createEntity(EntityManager em) {
        MultiTask multiTask = new MultiTask()
            .creationTime(DEFAULT_CREATION_TIME)
            .taskingParameter(DEFAULT_TASKING_PARAMETER);
        return multiTask;
    }

    @Before
    public void initTest() {
        multiTask = createEntity(em);
    }

    @Test
    @Transactional
    public void createMultiTask() throws Exception {
        int databaseSizeBeforeCreate = multiTaskRepository.findAll().size();

        // Create the MultiTask
        restMultiTaskMockMvc.perform(post("/api/multi-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multiTask)))
            .andExpect(status().isCreated());

        // Validate the MultiTask in the database
        List<MultiTask> multiTaskList = multiTaskRepository.findAll();
        assertThat(multiTaskList).hasSize(databaseSizeBeforeCreate + 1);
        MultiTask testMultiTask = multiTaskList.get(multiTaskList.size() - 1);
        assertThat(testMultiTask.getCreationTime()).isEqualTo(DEFAULT_CREATION_TIME);
        assertThat(testMultiTask.getTaskingParameter()).isEqualTo(DEFAULT_TASKING_PARAMETER);

        // Validate the MultiTask in Elasticsearch
        verify(mockMultiTaskSearchRepository, times(1)).save(testMultiTask);
    }

    @Test
    @Transactional
    public void createMultiTaskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = multiTaskRepository.findAll().size();

        // Create the MultiTask with an existing ID
        multiTask.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMultiTaskMockMvc.perform(post("/api/multi-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multiTask)))
            .andExpect(status().isBadRequest());

        // Validate the MultiTask in the database
        List<MultiTask> multiTaskList = multiTaskRepository.findAll();
        assertThat(multiTaskList).hasSize(databaseSizeBeforeCreate);

        // Validate the MultiTask in Elasticsearch
        verify(mockMultiTaskSearchRepository, times(0)).save(multiTask);
    }

    @Test
    @Transactional
    public void getAllMultiTasks() throws Exception {
        // Initialize the database
        multiTaskRepository.saveAndFlush(multiTask);

        // Get all the multiTaskList
        restMultiTaskMockMvc.perform(get("/api/multi-tasks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(multiTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationTime").value(hasItem(DEFAULT_CREATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].taskingParameter").value(hasItem(DEFAULT_TASKING_PARAMETER.toString())));
    }
    
    @Test
    @Transactional
    public void getMultiTask() throws Exception {
        // Initialize the database
        multiTaskRepository.saveAndFlush(multiTask);

        // Get the multiTask
        restMultiTaskMockMvc.perform(get("/api/multi-tasks/{id}", multiTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(multiTask.getId().intValue()))
            .andExpect(jsonPath("$.creationTime").value(DEFAULT_CREATION_TIME.toString()))
            .andExpect(jsonPath("$.taskingParameter").value(DEFAULT_TASKING_PARAMETER.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMultiTask() throws Exception {
        // Get the multiTask
        restMultiTaskMockMvc.perform(get("/api/multi-tasks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMultiTask() throws Exception {
        // Initialize the database
        multiTaskRepository.saveAndFlush(multiTask);

        int databaseSizeBeforeUpdate = multiTaskRepository.findAll().size();

        // Update the multiTask
        MultiTask updatedMultiTask = multiTaskRepository.findById(multiTask.getId()).get();
        // Disconnect from session so that the updates on updatedMultiTask are not directly saved in db
        em.detach(updatedMultiTask);
        updatedMultiTask
            .creationTime(UPDATED_CREATION_TIME)
            .taskingParameter(UPDATED_TASKING_PARAMETER);

        restMultiTaskMockMvc.perform(put("/api/multi-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMultiTask)))
            .andExpect(status().isOk());

        // Validate the MultiTask in the database
        List<MultiTask> multiTaskList = multiTaskRepository.findAll();
        assertThat(multiTaskList).hasSize(databaseSizeBeforeUpdate);
        MultiTask testMultiTask = multiTaskList.get(multiTaskList.size() - 1);
        assertThat(testMultiTask.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testMultiTask.getTaskingParameter()).isEqualTo(UPDATED_TASKING_PARAMETER);

        // Validate the MultiTask in Elasticsearch
        verify(mockMultiTaskSearchRepository, times(1)).save(testMultiTask);
    }

    @Test
    @Transactional
    public void updateNonExistingMultiTask() throws Exception {
        int databaseSizeBeforeUpdate = multiTaskRepository.findAll().size();

        // Create the MultiTask

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMultiTaskMockMvc.perform(put("/api/multi-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(multiTask)))
            .andExpect(status().isBadRequest());

        // Validate the MultiTask in the database
        List<MultiTask> multiTaskList = multiTaskRepository.findAll();
        assertThat(multiTaskList).hasSize(databaseSizeBeforeUpdate);

        // Validate the MultiTask in Elasticsearch
        verify(mockMultiTaskSearchRepository, times(0)).save(multiTask);
    }

    @Test
    @Transactional
    public void deleteMultiTask() throws Exception {
        // Initialize the database
        multiTaskRepository.saveAndFlush(multiTask);

        int databaseSizeBeforeDelete = multiTaskRepository.findAll().size();

        // Get the multiTask
        restMultiTaskMockMvc.perform(delete("/api/multi-tasks/{id}", multiTask.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MultiTask> multiTaskList = multiTaskRepository.findAll();
        assertThat(multiTaskList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the MultiTask in Elasticsearch
        verify(mockMultiTaskSearchRepository, times(1)).deleteById(multiTask.getId());
    }

    @Test
    @Transactional
    public void searchMultiTask() throws Exception {
        // Initialize the database
        multiTaskRepository.saveAndFlush(multiTask);
        when(mockMultiTaskSearchRepository.search(queryStringQuery("id:" + multiTask.getId())))
            .thenReturn(Collections.singletonList(multiTask));
        // Search the multiTask
        restMultiTaskMockMvc.perform(get("/api/_search/multi-tasks?query=id:" + multiTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(multiTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationTime").value(hasItem(DEFAULT_CREATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].taskingParameter").value(hasItem(DEFAULT_TASKING_PARAMETER)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MultiTask.class);
        MultiTask multiTask1 = new MultiTask();
        multiTask1.setId(1L);
        MultiTask multiTask2 = new MultiTask();
        multiTask2.setId(multiTask1.getId());
        assertThat(multiTask1).isEqualTo(multiTask2);
        multiTask2.setId(2L);
        assertThat(multiTask1).isNotEqualTo(multiTask2);
        multiTask1.setId(null);
        assertThat(multiTask1).isNotEqualTo(multiTask2);
    }
}
