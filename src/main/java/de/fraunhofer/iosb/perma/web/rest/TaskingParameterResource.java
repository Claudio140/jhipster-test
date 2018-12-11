package de.fraunhofer.iosb.perma.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.fraunhofer.iosb.perma.domain.TaskingParameter;
import de.fraunhofer.iosb.perma.repository.TaskingParameterRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskingParameterSearchRepository;
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
 * REST controller for managing TaskingParameter.
 */
@RestController
@RequestMapping("/api")
public class TaskingParameterResource {

    private final Logger log = LoggerFactory.getLogger(TaskingParameterResource.class);

    private static final String ENTITY_NAME = "taskingParameter";

    private final TaskingParameterRepository taskingParameterRepository;

    private final TaskingParameterSearchRepository taskingParameterSearchRepository;

    public TaskingParameterResource(TaskingParameterRepository taskingParameterRepository, TaskingParameterSearchRepository taskingParameterSearchRepository) {
        this.taskingParameterRepository = taskingParameterRepository;
        this.taskingParameterSearchRepository = taskingParameterSearchRepository;
    }

    /**
     * POST  /tasking-parameters : Create a new taskingParameter.
     *
     * @param taskingParameter the taskingParameter to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskingParameter, or with status 400 (Bad Request) if the taskingParameter has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tasking-parameters")
    @Timed
    public ResponseEntity<TaskingParameter> createTaskingParameter(@RequestBody TaskingParameter taskingParameter) throws URISyntaxException {
        log.debug("REST request to save TaskingParameter : {}", taskingParameter);
        if (taskingParameter.getId() != null) {
            throw new BadRequestAlertException("A new taskingParameter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TaskingParameter result = taskingParameterRepository.save(taskingParameter);
        taskingParameterSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tasking-parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tasking-parameters : Updates an existing taskingParameter.
     *
     * @param taskingParameter the taskingParameter to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskingParameter,
     * or with status 400 (Bad Request) if the taskingParameter is not valid,
     * or with status 500 (Internal Server Error) if the taskingParameter couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tasking-parameters")
    @Timed
    public ResponseEntity<TaskingParameter> updateTaskingParameter(@RequestBody TaskingParameter taskingParameter) throws URISyntaxException {
        log.debug("REST request to update TaskingParameter : {}", taskingParameter);
        if (taskingParameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TaskingParameter result = taskingParameterRepository.save(taskingParameter);
        taskingParameterSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, taskingParameter.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tasking-parameters : get all the taskingParameters.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of taskingParameters in body
     */
    @GetMapping("/tasking-parameters")
    @Timed
    public List<TaskingParameter> getAllTaskingParameters() {
        log.debug("REST request to get all TaskingParameters");
        return taskingParameterRepository.findAll();
    }

    /**
     * GET  /tasking-parameters/:id : get the "id" taskingParameter.
     *
     * @param id the id of the taskingParameter to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskingParameter, or with status 404 (Not Found)
     */
    @GetMapping("/tasking-parameters/{id}")
    @Timed
    public ResponseEntity<TaskingParameter> getTaskingParameter(@PathVariable Long id) {
        log.debug("REST request to get TaskingParameter : {}", id);
        Optional<TaskingParameter> taskingParameter = taskingParameterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(taskingParameter);
    }

    /**
     * DELETE  /tasking-parameters/:id : delete the "id" taskingParameter.
     *
     * @param id the id of the taskingParameter to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tasking-parameters/{id}")
    @Timed
    public ResponseEntity<Void> deleteTaskingParameter(@PathVariable Long id) {
        log.debug("REST request to delete TaskingParameter : {}", id);

        taskingParameterRepository.deleteById(id);
        taskingParameterSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tasking-parameters?query=:query : search for the taskingParameter corresponding
     * to the query.
     *
     * @param query the query of the taskingParameter search
     * @return the result of the search
     */
    @GetMapping("/_search/tasking-parameters")
    @Timed
    public List<TaskingParameter> searchTaskingParameters(@RequestParam String query) {
        log.debug("REST request to search TaskingParameters for query {}", query);
        return StreamSupport
            .stream(taskingParameterSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
