package de.fraunhofer.iosb.perma.web.rest;

import de.fraunhofer.iosb.perma.PermaApp;

import de.fraunhofer.iosb.perma.domain.TaskingCapability;
import de.fraunhofer.iosb.perma.repository.TaskingCapabilityRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskingCapabilitySearchRepository;
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
 * Test class for the TaskingCapabilityResource REST controller.
 *
 * @see TaskingCapabilityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PermaApp.class)
public class TaskingCapabilityResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_TASKING_PARAMETERS = "AAAAAAAAAA";
    private static final String UPDATED_TASKING_PARAMETERS = "BBBBBBBBBB";

    private static final String DEFAULT_PROPERTIES = "AAAAAAAAAA";
    private static final String UPDATED_PROPERTIES = "BBBBBBBBBB";

    @Autowired
    private TaskingCapabilityRepository taskingCapabilityRepository;

    /**
     * This repository is mocked in the de.fraunhofer.iosb.perma.repository.search test package.
     *
     * @see de.fraunhofer.iosb.perma.repository.search.TaskingCapabilitySearchRepositoryMockConfiguration
     */
    @Autowired
    private TaskingCapabilitySearchRepository mockTaskingCapabilitySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTaskingCapabilityMockMvc;

    private TaskingCapability taskingCapability;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TaskingCapabilityResource taskingCapabilityResource = new TaskingCapabilityResource(taskingCapabilityRepository, mockTaskingCapabilitySearchRepository);
        this.restTaskingCapabilityMockMvc = MockMvcBuilders.standaloneSetup(taskingCapabilityResource)
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
    public static TaskingCapability createEntity(EntityManager em) {
        TaskingCapability taskingCapability = new TaskingCapability()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .taskingParameters(DEFAULT_TASKING_PARAMETERS)
            .properties(DEFAULT_PROPERTIES);
        return taskingCapability;
    }

    @Before
    public void initTest() {
        taskingCapability = createEntity(em);
    }

    @Test
    @Transactional
    public void createTaskingCapability() throws Exception {
        int databaseSizeBeforeCreate = taskingCapabilityRepository.findAll().size();

        // Create the TaskingCapability
        restTaskingCapabilityMockMvc.perform(post("/api/tasking-capabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingCapability)))
            .andExpect(status().isCreated());

        // Validate the TaskingCapability in the database
        List<TaskingCapability> taskingCapabilityList = taskingCapabilityRepository.findAll();
        assertThat(taskingCapabilityList).hasSize(databaseSizeBeforeCreate + 1);
        TaskingCapability testTaskingCapability = taskingCapabilityList.get(taskingCapabilityList.size() - 1);
        assertThat(testTaskingCapability.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTaskingCapability.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTaskingCapability.getTaskingParameters()).isEqualTo(DEFAULT_TASKING_PARAMETERS);
        assertThat(testTaskingCapability.getProperties()).isEqualTo(DEFAULT_PROPERTIES);

        // Validate the TaskingCapability in Elasticsearch
        verify(mockTaskingCapabilitySearchRepository, times(1)).save(testTaskingCapability);
    }

    @Test
    @Transactional
    public void createTaskingCapabilityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = taskingCapabilityRepository.findAll().size();

        // Create the TaskingCapability with an existing ID
        taskingCapability.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskingCapabilityMockMvc.perform(post("/api/tasking-capabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingCapability)))
            .andExpect(status().isBadRequest());

        // Validate the TaskingCapability in the database
        List<TaskingCapability> taskingCapabilityList = taskingCapabilityRepository.findAll();
        assertThat(taskingCapabilityList).hasSize(databaseSizeBeforeCreate);

        // Validate the TaskingCapability in Elasticsearch
        verify(mockTaskingCapabilitySearchRepository, times(0)).save(taskingCapability);
    }

    @Test
    @Transactional
    public void getAllTaskingCapabilities() throws Exception {
        // Initialize the database
        taskingCapabilityRepository.saveAndFlush(taskingCapability);

        // Get all the taskingCapabilityList
        restTaskingCapabilityMockMvc.perform(get("/api/tasking-capabilities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskingCapability.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].taskingParameters").value(hasItem(DEFAULT_TASKING_PARAMETERS.toString())))
            .andExpect(jsonPath("$.[*].properties").value(hasItem(DEFAULT_PROPERTIES.toString())));
    }
    
    @Test
    @Transactional
    public void getTaskingCapability() throws Exception {
        // Initialize the database
        taskingCapabilityRepository.saveAndFlush(taskingCapability);

        // Get the taskingCapability
        restTaskingCapabilityMockMvc.perform(get("/api/tasking-capabilities/{id}", taskingCapability.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(taskingCapability.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.taskingParameters").value(DEFAULT_TASKING_PARAMETERS.toString()))
            .andExpect(jsonPath("$.properties").value(DEFAULT_PROPERTIES.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTaskingCapability() throws Exception {
        // Get the taskingCapability
        restTaskingCapabilityMockMvc.perform(get("/api/tasking-capabilities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaskingCapability() throws Exception {
        // Initialize the database
        taskingCapabilityRepository.saveAndFlush(taskingCapability);

        int databaseSizeBeforeUpdate = taskingCapabilityRepository.findAll().size();

        // Update the taskingCapability
        TaskingCapability updatedTaskingCapability = taskingCapabilityRepository.findById(taskingCapability.getId()).get();
        // Disconnect from session so that the updates on updatedTaskingCapability are not directly saved in db
        em.detach(updatedTaskingCapability);
        updatedTaskingCapability
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .taskingParameters(UPDATED_TASKING_PARAMETERS)
            .properties(UPDATED_PROPERTIES);

        restTaskingCapabilityMockMvc.perform(put("/api/tasking-capabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTaskingCapability)))
            .andExpect(status().isOk());

        // Validate the TaskingCapability in the database
        List<TaskingCapability> taskingCapabilityList = taskingCapabilityRepository.findAll();
        assertThat(taskingCapabilityList).hasSize(databaseSizeBeforeUpdate);
        TaskingCapability testTaskingCapability = taskingCapabilityList.get(taskingCapabilityList.size() - 1);
        assertThat(testTaskingCapability.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTaskingCapability.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTaskingCapability.getTaskingParameters()).isEqualTo(UPDATED_TASKING_PARAMETERS);
        assertThat(testTaskingCapability.getProperties()).isEqualTo(UPDATED_PROPERTIES);

        // Validate the TaskingCapability in Elasticsearch
        verify(mockTaskingCapabilitySearchRepository, times(1)).save(testTaskingCapability);
    }

    @Test
    @Transactional
    public void updateNonExistingTaskingCapability() throws Exception {
        int databaseSizeBeforeUpdate = taskingCapabilityRepository.findAll().size();

        // Create the TaskingCapability

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskingCapabilityMockMvc.perform(put("/api/tasking-capabilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(taskingCapability)))
            .andExpect(status().isBadRequest());

        // Validate the TaskingCapability in the database
        List<TaskingCapability> taskingCapabilityList = taskingCapabilityRepository.findAll();
        assertThat(taskingCapabilityList).hasSize(databaseSizeBeforeUpdate);

        // Validate the TaskingCapability in Elasticsearch
        verify(mockTaskingCapabilitySearchRepository, times(0)).save(taskingCapability);
    }

    @Test
    @Transactional
    public void deleteTaskingCapability() throws Exception {
        // Initialize the database
        taskingCapabilityRepository.saveAndFlush(taskingCapability);

        int databaseSizeBeforeDelete = taskingCapabilityRepository.findAll().size();

        // Get the taskingCapability
        restTaskingCapabilityMockMvc.perform(delete("/api/tasking-capabilities/{id}", taskingCapability.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TaskingCapability> taskingCapabilityList = taskingCapabilityRepository.findAll();
        assertThat(taskingCapabilityList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the TaskingCapability in Elasticsearch
        verify(mockTaskingCapabilitySearchRepository, times(1)).deleteById(taskingCapability.getId());
    }

    @Test
    @Transactional
    public void searchTaskingCapability() throws Exception {
        // Initialize the database
        taskingCapabilityRepository.saveAndFlush(taskingCapability);
        when(mockTaskingCapabilitySearchRepository.search(queryStringQuery("id:" + taskingCapability.getId())))
            .thenReturn(Collections.singletonList(taskingCapability));
        // Search the taskingCapability
        restTaskingCapabilityMockMvc.perform(get("/api/_search/tasking-capabilities?query=id:" + taskingCapability.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taskingCapability.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].taskingParameters").value(hasItem(DEFAULT_TASKING_PARAMETERS)))
            .andExpect(jsonPath("$.[*].properties").value(hasItem(DEFAULT_PROPERTIES)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TaskingCapability.class);
        TaskingCapability taskingCapability1 = new TaskingCapability();
        taskingCapability1.setId(1L);
        TaskingCapability taskingCapability2 = new TaskingCapability();
        taskingCapability2.setId(taskingCapability1.getId());
        assertThat(taskingCapability1).isEqualTo(taskingCapability2);
        taskingCapability2.setId(2L);
        assertThat(taskingCapability1).isNotEqualTo(taskingCapability2);
        taskingCapability1.setId(null);
        assertThat(taskingCapability1).isNotEqualTo(taskingCapability2);
    }
}
