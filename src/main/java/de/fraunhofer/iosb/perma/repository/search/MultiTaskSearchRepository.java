package de.fraunhofer.iosb.perma.repository.search;

import de.fraunhofer.iosb.perma.domain.MultiTask;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the MultiTask entity.
 */
public interface MultiTaskSearchRepository extends ElasticsearchRepository<MultiTask, Long> {
}
