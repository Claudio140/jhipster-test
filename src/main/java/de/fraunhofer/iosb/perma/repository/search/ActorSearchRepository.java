package de.fraunhofer.iosb.perma.repository.search;

import de.fraunhofer.iosb.perma.domain.Actor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Actor entity.
 */
public interface ActorSearchRepository extends ElasticsearchRepository<Actor, Long> {
}
