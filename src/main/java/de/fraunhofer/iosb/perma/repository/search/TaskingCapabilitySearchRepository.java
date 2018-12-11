package de.fraunhofer.iosb.perma.repository.search;

import de.fraunhofer.iosb.perma.domain.TaskingCapability;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TaskingCapability entity.
 */
public interface TaskingCapabilitySearchRepository extends ElasticsearchRepository<TaskingCapability, Long> {
}
