package de.fraunhofer.iosb.perma.web.rest;

import de.fraunhofer.iosb.perma.PermaApp;

import de.fraunhofer.iosb.perma.domain.TaskExecution;
import de.fraunhofer.iosb.perma.repository.TaskExecutionRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskExecutionSearchRepository;
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
 * Test class for the TaskExecutionResource REST controller.
 *
 * @see TaskExecutionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PermaApp.class)
public class TaskExecutionResourceIntTest {

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private TaskExecutionRepository taskExecutionRepository;

    /**
     * This repository is mocked in the de.fraunhofer.iosb.perma.repository.search test package.
     *
     * @see de.fraunhofer.iosb.perma.repository.search.TaskExecutionSearchRepositoryMockConfiguration
     */
    @Autowired
    private TaskExecutionSearchRepository mockTaskExecutionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTaskExecutionMockMvc;

    private TaskExecution taskExecution;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TaskExecutionResource taskExecutionResource = new TaskExecutionResource(taskExecutionRepository, mockTaskExecutionSearchRepository);
        this.restTaskExecutionMockMvc = MockMvcBuilders.standaloneSetup(taskExecutionResource)
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
    public static TaskExecution createEntity(EntityManager em) {
        TaskExecution taskExecution = new TaskExecution()
            .timestamp(DEFAULT_TIMESTAMP);
        return taskExecution;
    }

    @Before
    public void initTest() {
        taskExecution = createEntity(em);
    }

    @Test
    @Transactional
    public void createTaskExecution() throws Exception {
        int databaseSizeBeforeCreate = taskExecutionRepository.findAll().size();

        // Create the TaskExecution
        restTaskExecutionMockMvc.perform(post("/api/task-executions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskExecution)))
            .andExpect(status().isCreated());

        // Validate the TaskExecution in the database
        List<TaskExecution> taskExecutionList = taskExecutionRepository.findAll();
        assertThat(taskExecutionList).hasSize(databaseSizeBeforeCreate + 1);
        TaskExecution testTaskExecution = taskExecutionList.get(taskExecutionList.size() - 1);
        assertThat(testTaskExecution.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);

        // Validate the TaskExecution in Elasticsearch
        verify(mockTaskExecutionSearchRepository, times(1)).save(testTaskExecution);
    }

    @Test
    @Transactional
    public void createTaskExecutionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = taskExecutionRepository.findAll().size();

        // Create the TaskExecution with an existing ID
        taskExecution.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskExecutionMockMvc.perform(post("/api/task-executions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskExecution)))
            .andExpect(status().isBadRequest());

        // Validate the TaskExecution in the database
        List<TaskExecution> taskExecutionList = taskExecutionRepository.findAll();
        assertThat(taskExecutionList).hasSize(databaseSizeBeforeCreate);

        // Validate the TaskExecution in Elasticsearch
        verify(mockTaskExecutionSearchRepository, times(0)).save(taskExecution);
    }

    @Test
    @Transactional
    public void getAllTaskExecutions() throws Exception {
        // Initialize the database
        taskExecutionRepository.saveAndFlush(taskExecution);

        // Get all the taskExecutionList
        restTaskExecutionMockMvc.perform(get("/api/task-executions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskExecution.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }
    
    @Test
    @Transactional
    public void getTaskExecution() throws Exception {
        // Initialize the database
        taskExecutionRepository.saveAndFlush(taskExecution);

        // Get the taskExecution
        restTaskExecutionMockMvc.perform(get("/api/task-executions/{id}", taskExecution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(taskExecution.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTaskExecution() throws Exception {
        // Get the taskExecution
        restTaskExecutionMockMvc.perform(get("/api/task-executions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaskExecution() throws Exception {
        // Initialize the database
        taskExecutionRepository.saveAndFlush(taskExecution);

        int databaseSizeBeforeUpdate = taskExecutionRepository.findAll().size();

        // Update the taskExecution
        TaskExecution updatedTaskExecution = taskExecutionRepository.findById(taskExecution.getId()).get();
        // Disconnect from session so that the updates on updatedTaskExecution are not directly saved in db
        em.detach(updatedTaskExecution);
        updatedTaskExecution
            .timestamp(UPDATED_TIMESTAMP);

        restTaskExecutionMockMvc.perform(put("/api/task-executions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTaskExecution)))
            .andExpect(status().isOk());

        // Validate the TaskExecution in the database
        List<TaskExecution> taskExecutionList = taskExecutionRepository.findAll();
        assertThat(taskExecutionList).hasSize(databaseSizeBeforeUpdate);
        TaskExecution testTaskExecution = taskExecutionList.get(taskExecutionList.size() - 1);
        assertThat(testTaskExecution.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);

        // Validate the TaskExecution in Elasticsearch
        verify(mockTaskExecutionSearchRepository, times(1)).save(testTaskExecution);
    }

    @Test
    @Transactional
    public void updateNonExistingTaskExecution() throws Exception {
        int databaseSizeBeforeUpdate = taskExecutionRepository.findAll().size();

        // Create the TaskExecution

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskExecutionMockMvc.perform(put("/api/task-executions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskExecution)))
            .andExpect(status().isBadRequest());

        // Validate the TaskExecution in the database
        List<TaskExecution> taskExecutionList = taskExecutionRepository.findAll();
        assertThat(taskExecutionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the TaskExecution in Elasticsearch
        verify(mockTaskExecutionSearchRepository, times(0)).save(taskExecution);
    }

    @Test
    @Transactional
    public void deleteTaskExecution() throws Exception {
        // Initialize the database
        taskExecutionRepository.saveAndFlush(taskExecution);

        int databaseSizeBeforeDelete = taskExecutionRepository.findAll().size();

        // Get the taskExecution
        restTaskExecutionMockMvc.perform(delete("/api/task-executions/{id}", taskExecution.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TaskExecution> taskExecutionList = taskExecutionRepository.findAll();
        assertThat(taskExecutionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the TaskExecution in Elasticsearch
        verify(mockTaskExecutionSearchRepository, times(1)).deleteById(taskExecution.getId());
    }

    @Test
    @Transactional
    public void searchTaskExecution() throws Exception {
        // Initialize the database
        taskExecutionRepository.saveAndFlush(taskExecution);
        when(mockTaskExecutionSearchRepository.search(queryStringQuery("id:" + taskExecution.getId())))
            .thenReturn(Collections.singletonList(taskExecution));
        // Search the taskExecution
        restTaskExecutionMockMvc.perform(get("/api/_search/task-executions?query=id:" + taskExecution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskExecution.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskExecution.class);
        TaskExecution taskExecution1 = new TaskExecution();
        taskExecution1.setId(1L);
        TaskExecution taskExecution2 = new TaskExecution();
        taskExecution2.setId(taskExecution1.getId());
        assertThat(taskExecution1).isEqualTo(taskExecution2);
        taskExecution2.setId(2L);
        assertThat(taskExecution1).isNotEqualTo(taskExecution2);
        taskExecution1.setId(null);
        assertThat(taskExecution1).isNotEqualTo(taskExecution2);
    }
}
