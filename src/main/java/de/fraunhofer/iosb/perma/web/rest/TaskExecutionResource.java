package de.fraunhofer.iosb.perma.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.fraunhofer.iosb.perma.domain.TaskExecution;
import de.fraunhofer.iosb.perma.repository.TaskExecutionRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskExecutionSearchRepository;
import de.fraunhofer.iosb.perma.web.rest.errors.BadRequestAlertException;
import de.fraunhofer.iosb.perma.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing TaskExecution.
 */
@RestController
@RequestMapping("/api")
public class TaskExecutionResource {

    private final Logger log = LoggerFactory.getLogger(TaskExecutionResource.class);

    private static final String ENTITY_NAME = "taskExecution";

    private final TaskExecutionRepository taskExecutionRepository;

    private final TaskExecutionSearchRepository taskExecutionSearchRepository;

    public TaskExecutionResource(TaskExecutionRepository taskExecutionRepository, TaskExecutionSearchRepository taskExecutionSearchRepository) {
        this.taskExecutionRepository = taskExecutionRepository;
        this.taskExecutionSearchRepository = taskExecutionSearchRepository;
    }

    /**
     * POST  /task-executions : Create a new taskExecution.
     *
     * @param taskExecution the taskExecution to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskExecution, or with status 400 (Bad Request) if the taskExecution has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/task-executions")
    @Timed
    public ResponseEntity<TaskExecution> createTaskExecution(@RequestBody TaskExecution taskExecution) throws URISyntaxException {
        log.debug("REST request to save TaskExecution : {}", taskExecution);
        if (taskExecution.getId() != null) {
            throw new BadRequestAlertException("A new taskExecution cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TaskExecution result = taskExecutionRepository.save(taskExecution);
        taskExecutionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/task-executions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /task-executions : Updates an existing taskExecution.
     *
     * @param taskExecution the taskExecution to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskExecution,
     * or with status 400 (Bad Request) if the taskExecution is not valid,
     * or with status 500 (Internal Server Error) if the taskExecution couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/task-executions")
    @Timed
    public ResponseEntity<TaskExecution> updateTaskExecution(@RequestBody TaskExecution taskExecution) throws URISyntaxException {
        log.debug("REST request to update TaskExecution : {}", taskExecution);
        if (taskExecution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TaskExecution result = taskExecutionRepository.save(taskExecution);
        taskExecutionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, taskExecution.getId().toString()))
            .body(result);
    }

    /**
     * GET  /task-executions : get all the taskExecutions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of taskExecutions in body
     */
    @GetMapping("/task-executions")
    @Timed
    public List<TaskExecution> getAllTaskExecutions() {
        log.debug("REST request to get all TaskExecutions");
        return taskExecutionRepository.findAll();
    }

    /**
     * GET  /task-executions/:id : get the "id" taskExecution.
     *
     * @param id the id of the taskExecution to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskExecution, or with status 404 (Not Found)
     */
    @GetMapping("/task-executions/{id}")
    @Timed
    public ResponseEntity<TaskExecution> getTaskExecution(@PathVariable Long id) {
        log.debug("REST request to get TaskExecution : {}", id);
        Optional<TaskExecution> taskExecution = taskExecutionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(taskExecution);
    }

    /**
     * DELETE  /task-executions/:id : delete the "id" taskExecution.
     *
     * @param id the id of the taskExecution to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/task-executions/{id}")
    @Timed
    public ResponseEntity<Void> deleteTaskExecution(@PathVariable Long id) {
        log.debug("REST request to delete TaskExecution : {}", id);

        taskExecutionRepository.deleteById(id);
        taskExecutionSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/task-executions?query=:query : search for the taskExecution corresponding
     * to the query.
     *
     * @param query the query of the taskExecution search
     * @return the result of the search
     */
    @GetMapping("/_search/task-executions")
    @Timed
    public List<TaskExecution> searchTaskExecutions(@RequestParam String query) {
        log.debug("REST request to search TaskExecutions for query {}", query);
        return StreamSupport
            .stream(taskExecutionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
