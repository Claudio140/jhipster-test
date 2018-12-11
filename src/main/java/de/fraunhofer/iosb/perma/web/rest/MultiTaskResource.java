package de.fraunhofer.iosb.perma.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.fraunhofer.iosb.perma.domain.MultiTask;
import de.fraunhofer.iosb.perma.repository.MultiTaskRepository;
import de.fraunhofer.iosb.perma.repository.search.MultiTaskSearchRepository;
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
 * REST controller for managing MultiTask.
 */
@RestController
@RequestMapping("/api")
public class MultiTaskResource {

    private final Logger log = LoggerFactory.getLogger(MultiTaskResource.class);

    private static final String ENTITY_NAME = "multiTask";

    private final MultiTaskRepository multiTaskRepository;

    private final MultiTaskSearchRepository multiTaskSearchRepository;

    public MultiTaskResource(MultiTaskRepository multiTaskRepository, MultiTaskSearchRepository multiTaskSearchRepository) {
        this.multiTaskRepository = multiTaskRepository;
        this.multiTaskSearchRepository = multiTaskSearchRepository;
    }

    /**
     * POST  /multi-tasks : Create a new multiTask.
     *
     * @param multiTask the multiTask to create
     * @return the ResponseEntity with status 201 (Created) and with body the new multiTask, or with status 400 (Bad Request) if the multiTask has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/multi-tasks")
    @Timed
    public ResponseEntity<MultiTask> createMultiTask(@RequestBody MultiTask multiTask) throws URISyntaxException {
        log.debug("REST request to save MultiTask : {}", multiTask);
        if (multiTask.getId() != null) {
            throw new BadRequestAlertException("A new multiTask cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MultiTask result = multiTaskRepository.save(multiTask);
        multiTaskSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/multi-tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /multi-tasks : Updates an existing multiTask.
     *
     * @param multiTask the multiTask to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated multiTask,
     * or with status 400 (Bad Request) if the multiTask is not valid,
     * or with status 500 (Internal Server Error) if the multiTask couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/multi-tasks")
    @Timed
    public ResponseEntity<MultiTask> updateMultiTask(@RequestBody MultiTask multiTask) throws URISyntaxException {
        log.debug("REST request to update MultiTask : {}", multiTask);
        if (multiTask.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MultiTask result = multiTaskRepository.save(multiTask);
        multiTaskSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, multiTask.getId().toString()))
            .body(result);
    }

    /**
     * GET  /multi-tasks : get all the multiTasks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of multiTasks in body
     */
    @GetMapping("/multi-tasks")
    @Timed
    public List<MultiTask> getAllMultiTasks() {
        log.debug("REST request to get all MultiTasks");
        return multiTaskRepository.findAll();
    }

    /**
     * GET  /multi-tasks/:id : get the "id" multiTask.
     *
     * @param id the id of the multiTask to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the multiTask, or with status 404 (Not Found)
     */
    @GetMapping("/multi-tasks/{id}")
    @Timed
    public ResponseEntity<MultiTask> getMultiTask(@PathVariable Long id) {
        log.debug("REST request to get MultiTask : {}", id);
        Optional<MultiTask> multiTask = multiTaskRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(multiTask);
    }

    /**
     * DELETE  /multi-tasks/:id : delete the "id" multiTask.
     *
     * @param id the id of the multiTask to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/multi-tasks/{id}")
    @Timed
    public ResponseEntity<Void> deleteMultiTask(@PathVariable Long id) {
        log.debug("REST request to delete MultiTask : {}", id);

        multiTaskRepository.deleteById(id);
        multiTaskSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/multi-tasks?query=:query : search for the multiTask corresponding
     * to the query.
     *
     * @param query the query of the multiTask search
     * @return the result of the search
     */
    @GetMapping("/_search/multi-tasks")
    @Timed
    public List<MultiTask> searchMultiTasks(@RequestParam String query) {
        log.debug("REST request to search MultiTasks for query {}", query);
        return StreamSupport
            .stream(multiTaskSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
