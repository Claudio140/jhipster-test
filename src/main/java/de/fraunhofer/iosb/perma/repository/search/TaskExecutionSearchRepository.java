package de.fraunhofer.iosb.perma.repository.search;

import de.fraunhofer.iosb.perma.domain.TaskExecution;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TaskExecution entity.
 */
public interface TaskExecutionSearchRepository extends ElasticsearchRepository<TaskExecution, Long> {
}
