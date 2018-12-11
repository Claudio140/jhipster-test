package de.fraunhofer.iosb.perma.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of TaskExecutionSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class TaskExecutionSearchRepositoryMockConfiguration {

    @MockBean
    private TaskExecutionSearchRepository mockTaskExecutionSearchRepository;

}
