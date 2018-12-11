package de.fraunhofer.iosb.perma.repository.search;

import de.fraunhofer.iosb.perma.domain.TaskingParameter;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TaskingParameter entity.
 */
public interface TaskingParameterSearchRepository extends ElasticsearchRepository<TaskingParameter, Long> {
}
