package de.fraunhofer.iosb.perma.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.fraunhofer.iosb.perma.domain.Actor;
import de.fraunhofer.iosb.perma.repository.ActorRepository;
import de.fraunhofer.iosb.perma.repository.search.ActorSearchRepository;
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
 * REST controller for managing Actor.
 */
@RestController
@RequestMapping("/api")
public class ActorResource {

    private final Logger log = LoggerFactory.getLogger(ActorResource.class);

    private static final String ENTITY_NAME = "actor";

    private final ActorRepository actorRepository;

    private final ActorSearchRepository actorSearchRepository;

    public ActorResource(ActorRepository actorRepository, ActorSearchRepository actorSearchRepository) {
        this.actorRepository = actorRepository;
        this.actorSearchRepository = actorSearchRepository;
    }

    /**
     * POST  /actors : Create a new actor.
     *
     * @param actor the actor to create
     * @return the ResponseEntity with status 201 (Created) and with body the new actor, or with status 400 (Bad Request) if the actor has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/actors")
    @Timed
    public ResponseEntity<Actor> createActor(@RequestBody Actor actor) throws URISyntaxException {
        log.debug("REST request to save Actor : {}", actor);
        if (actor.getId() != null) {
            throw new BadRequestAlertException("A new actor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Actor result = actorRepository.save(actor);
        actorSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/actors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /actors : Updates an existing actor.
     *
     * @param actor the actor to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated actor,
     * or with status 400 (Bad Request) if the actor is not valid,
     * or with status 500 (Internal Server Error) if the actor couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/actors")
    @Timed
    public ResponseEntity<Actor> updateActor(@RequestBody Actor actor) throws URISyntaxException {
        log.debug("REST request to update Actor : {}", actor);
        if (actor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Actor result = actorRepository.save(actor);
        actorSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, actor.getId().toString()))
            .body(result);
    }

    /**
     * GET  /actors : get all the actors.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of actors in body
     */
    @GetMapping("/actors")
    @Timed
    public List<Actor> getAllActors(@RequestParam(required = false) String filter) {
        if ("location-is-null".equals(filter)) {
            log.debug("REST request to get all Actors where location is null");
            return StreamSupport
                .stream(actorRepository.findAll().spliterator(), false)
                .filter(actor -> actor.getLocation() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Actors");
        return actorRepository.findAll();
    }

    /**
     * GET  /actors/:id : get the "id" actor.
     *
     * @param id the id of the actor to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the actor, or with status 404 (Not Found)
     */
    @GetMapping("/actors/{id}")
    @Timed
    public ResponseEntity<Actor> getActor(@PathVariable Long id) {
        log.debug("REST request to get Actor : {}", id);
        Optional<Actor> actor = actorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(actor);
    }

    /**
     * DELETE  /actors/:id : delete the "id" actor.
     *
     * @param id the id of the actor to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/actors/{id}")
    @Timed
    public ResponseEntity<Void> deleteActor(@PathVariable Long id) {
        log.debug("REST request to delete Actor : {}", id);

        actorRepository.deleteById(id);
        actorSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/actors?query=:query : search for the actor corresponding
     * to the query.
     *
     * @param query the query of the actor search
     * @return the result of the search
     */
    @GetMapping("/_search/actors")
    @Timed
    public List<Actor> searchActors(@RequestParam String query) {
        log.debug("REST request to search Actors for query {}", query);
        return StreamSupport
            .stream(actorSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
