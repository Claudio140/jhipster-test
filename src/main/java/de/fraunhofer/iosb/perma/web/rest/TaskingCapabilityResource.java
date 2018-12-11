package de.fraunhofer.iosb.perma.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.fraunhofer.iosb.perma.domain.TaskingCapability;
import de.fraunhofer.iosb.perma.repository.TaskingCapabilityRepository;
import de.fraunhofer.iosb.perma.repository.search.TaskingCapabilitySearchRepository;
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
 * REST controller for managing TaskingCapability.
 */
@RestController
@RequestMapping("/api")
public class TaskingCapabilityResource {

    private final Logger log = LoggerFactory.getLogger(TaskingCapabilityResource.class);

    private static final String ENTITY_NAME = "taskingCapability";

    private final TaskingCapabilityRepository taskingCapabilityRepository;

    private final TaskingCapabilitySearchRepository taskingCapabilitySearchRepository;

    public TaskingCapabilityResource(TaskingCapabilityRepository taskingCapabilityRepository, TaskingCapabilitySearchRepository taskingCapabilitySearchRepository) {
        this.taskingCapabilityRepository = taskingCapabilityRepository;
        this.taskingCapabilitySearchRepository = taskingCapabilitySearchRepository;
    }

    /**
     * POST  /tasking-capabilities : Create a new taskingCapability.
     *
     * @param taskingCapability the taskingCapability to create
     * @return the ResponseEntity with status 201 (Created) and with body the new taskingCapability, or with status 400 (Bad Request) if the taskingCapability has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tasking-capabilities")
    @Timed
    public ResponseEntity<TaskingCapability> createTaskingCapability(@RequestBody TaskingCapability taskingCapability) throws URISyntaxException {
        log.debug("REST request to save TaskingCapability : {}", taskingCapability);
        if (taskingCapability.getId() != null) {
            throw new BadRequestAlertException("A new taskingCapability cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TaskingCapability result = taskingCapabilityRepository.save(taskingCapability);
        taskingCapabilitySearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tasking-capabilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tasking-capabilities : Updates an existing taskingCapability.
     *
     * @param taskingCapability the taskingCapability to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated taskingCapability,
     * or with status 400 (Bad Request) if the taskingCapability is not valid,
     * or with status 500 (Internal Server Error) if the taskingCapability couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tasking-capabilities")
    @Timed
    public ResponseEntity<TaskingCapability> updateTaskingCapability(@RequestBody TaskingCapability taskingCapability) throws URISyntaxException {
        log.debug("REST request to update TaskingCapability : {}", taskingCapability);
        if (taskingCapability.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TaskingCapability result = taskingCapabilityRepository.save(taskingCapability);
        taskingCapabilitySearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, taskingCapability.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tasking-capabilities : get all the taskingCapabilities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of taskingCapabilities in body
     */
    @GetMapping("/tasking-capabilities")
    @Timed
    public List<TaskingCapability> getAllTaskingCapabilities() {
        log.debug("REST request to get all TaskingCapabilities");
        return taskingCapabilityRepository.findAll();
    }

    /**
     * GET  /tasking-capabilities/:id : get the "id" taskingCapability.
     *
     * @param id the id of the taskingCapability to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the taskingCapability, or with status 404 (Not Found)
     */
    @GetMapping("/tasking-capabilities/{id}")
    @Timed
    public ResponseEntity<TaskingCapability> getTaskingCapability(@PathVariable Long id) {
        log.debug("REST request to get TaskingCapability : {}", id);
        Optional<TaskingCapability> taskingCapability = taskingCapabilityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(taskingCapability);
    }

    /**
     * DELETE  /tasking-capabilities/:id : delete the "id" taskingCapability.
     *
     * @param id the id of the taskingCapability to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tasking-capabilities/{id}")
    @Timed
    public ResponseEntity<Void> deleteTaskingCapability(@PathVariable Long id) {
        log.debug("REST request to delete TaskingCapability : {}", id);

        taskingCapabilityRepository.deleteById(id);
        taskingCapabilitySearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tasking-capabilities?query=:query : search for the taskingCapability corresponding
     * to the query.
     *
     * @param query the query of the taskingCapability search
     * @return the result of the search
     */
    @GetMapping("/_search/tasking-capabilities")
    @Timed
    public List<TaskingCapability> searchTaskingCapabilities(@RequestParam String query) {
        log.debug("REST request to search TaskingCapabilities for query {}", query);
        return StreamSupport
            .stream(taskingCapabilitySearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
