package de.fraunhofer.iosb.perma.web.rest;

import de.fraunhofer.iosb.perma.PermaApp;

import de.fraunhofer.iosb.perma.domain.TaskingParameter;
import de.fraunhofer.iosb.perma.repository.TaskingParameterRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskingParameterSearchRepository;
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
 * Test class for the TaskingParameterResource REST controller.
 *
 * @see TaskingParameterResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PermaApp.class)
public class TaskingParameterResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private TaskingParameterRepository taskingParameterRepository;

    /**
     * This repository is mocked in the de.fraunhofer.iosb.perma.repository.search test package.
     *
     * @see de.fraunhofer.iosb.perma.repository.search.TaskingParameterSearchRepositoryMockConfiguration
     */
    @Autowired
    private TaskingParameterSearchRepository mockTaskingParameterSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTaskingParameterMockMvc;

    private TaskingParameter taskingParameter;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TaskingParameterResource taskingParameterResource = new TaskingParameterResource(taskingParameterRepository, mockTaskingParameterSearchRepository);
        this.restTaskingParameterMockMvc = MockMvcBuilders.standaloneSetup(taskingParameterResource)
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
    public static TaskingParameter createEntity(EntityManager em) {
        TaskingParameter taskingParameter = new TaskingParameter()
            .name(DEFAULT_NAME);
        return taskingParameter;
    }

    @Before
    public void initTest() {
        taskingParameter = createEntity(em);
    }

    @Test
    @Transactional
    public void createTaskingParameter() throws Exception {
        int databaseSizeBeforeCreate = taskingParameterRepository.findAll().size();

        // Create the TaskingParameter
        restTaskingParameterMockMvc.perform(post("/api/tasking-parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingParameter)))
            .andExpect(status().isCreated());

        // Validate the TaskingParameter in the database
        List<TaskingParameter> taskingParameterList = taskingParameterRepository.findAll();
        assertThat(taskingParameterList).hasSize(databaseSizeBeforeCreate + 1);
        TaskingParameter testTaskingParameter = taskingParameterList.get(taskingParameterList.size() - 1);
        assertThat(testTaskingParameter.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the TaskingParameter in Elasticsearch
        verify(mockTaskingParameterSearchRepository, times(1)).save(testTaskingParameter);
    }

    @Test
    @Transactional
    public void createTaskingParameterWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = taskingParameterRepository.findAll().size();

        // Create the TaskingParameter with an existing ID
        taskingParameter.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskingParameterMockMvc.perform(post("/api/tasking-parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingParameter)))
            .andExpect(status().isBadRequest());

        // Validate the TaskingParameter in the database
        List<TaskingParameter> taskingParameterList = taskingParameterRepository.findAll();
        assertThat(taskingParameterList).hasSize(databaseSizeBeforeCreate);

        // Validate the TaskingParameter in Elasticsearch
        verify(mockTaskingParameterSearchRepository, times(0)).save(taskingParameter);
    }

    @Test
    @Transactional
    public void getAllTaskingParameters() throws Exception {
        // Initialize the database
        taskingParameterRepository.saveAndFlush(taskingParameter);

        // Get all the taskingParameterList
        restTaskingParameterMockMvc.perform(get("/api/tasking-parameters?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskingParameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getTaskingParameter() throws Exception {
        // Initialize the database
        taskingParameterRepository.saveAndFlush(taskingParameter);

        // Get the taskingParameter
        restTaskingParameterMockMvc.perform(get("/api/tasking-parameters/{id}", taskingParameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(taskingParameter.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTaskingParameter() throws Exception {
        // Get the taskingParameter
        restTaskingParameterMockMvc.perform(get("/api/tasking-parameters/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaskingParameter() throws Exception {
        // Initialize the database
        taskingParameterRepository.saveAndFlush(taskingParameter);

        int databaseSizeBeforeUpdate = taskingParameterRepository.findAll().size();

        // Update the taskingParameter
        TaskingParameter updatedTaskingParameter = taskingParameterRepository.findById(taskingParameter.getId()).get();
        // Disconnect from session so that the updates on updatedTaskingParameter are not directly saved in db
        em.detach(updatedTaskingParameter);
        updatedTaskingParameter
            .name(UPDATED_NAME);

        restTaskingParameterMockMvc.perform(put("/api/tasking-parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTaskingParameter)))
            .andExpect(status().isOk());

        // Validate the TaskingParameter in the database
        List<TaskingParameter> taskingParameterList = taskingParameterRepository.findAll();
        assertThat(taskingParameterList).hasSize(databaseSizeBeforeUpdate);
        TaskingParameter testTaskingParameter = taskingParameterList.get(taskingParameterList.size() - 1);
        assertThat(testTaskingParameter.getName()).isEqualTo(UPDATED_NAME);

        // Validate the TaskingParameter in Elasticsearch
        verify(mockTaskingParameterSearchRepository, times(1)).save(testTaskingParameter);
    }

    @Test
    @Transactional
    public void updateNonExistingTaskingParameter() throws Exception {
        int databaseSizeBeforeUpdate = taskingParameterRepository.findAll().size();

        // Create the TaskingParameter

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskingParameterMockMvc.perform(put("/api/tasking-parameters")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingParameter)))
            .andExpect(status().isBadRequest());

        // Validate the TaskingParameter in the database
        List<TaskingParameter> taskingParameterList = taskingParameterRepository.findAll();
        assertThat(taskingParameterList).hasSize(databaseSizeBeforeUpdate);

        // Validate the TaskingParameter in Elasticsearch
        verify(mockTaskingParameterSearchRepository, times(0)).save(taskingParameter);
    }

    @Test
    @Transactional
    public void deleteTaskingParameter() throws Exception {
        // Initialize the database
        taskingParameterRepository.saveAndFlush(taskingParameter);

        int databaseSizeBeforeDelete = taskingParameterRepository.findAll().size();

        // Get the taskingParameter
        restTaskingParameterMockMvc.perform(delete("/api/tasking-parameters/{id}", taskingParameter.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TaskingParameter> taskingParameterList = taskingParameterRepository.findAll();
        assertThat(taskingParameterList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the TaskingParameter in Elasticsearch
        verify(mockTaskingParameterSearchRepository, times(1)).deleteById(taskingParameter.getId());
    }

    @Test
    @Transactional
    public void searchTaskingParameter() throws Exception {
        // Initialize the database
        taskingParameterRepository.saveAndFlush(taskingParameter);
        when(mockTaskingParameterSearchRepository.search(queryStringQuery("id:" + taskingParameter.getId())))
            .thenReturn(Collections.singletonList(taskingParameter));
        // Search the taskingParameter
        restTaskingParameterMockMvc.perform(get("/api/_search/tasking-parameters?query=id:" + taskingParameter.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskingParameter.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskingParameter.class);
        TaskingParameter taskingParameter1 = new TaskingParameter();
        taskingParameter1.setId(1L);
        TaskingParameter taskingParameter2 = new TaskingParameter();
        taskingParameter2.setId(taskingParameter1.getId());
        assertThat(taskingParameter1).isEqualTo(taskingParameter2);
        taskingParameter2.setId(2L);
        assertThat(taskingParameter1).isNotEqualTo(taskingParameter2);
        taskingParameter1.setId(null);
        assertThat(taskingParameter1).isNotEqualTo(taskingParameter2);
    }
}
