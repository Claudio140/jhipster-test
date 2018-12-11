package de.fraunhofer.iosb.perma.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of TaskingParameterSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class TaskingParameterSearchRepositoryMockConfiguration {

    @MockBean
    private TaskingParameterSearchRepository mockTaskingParameterSearchRepository;

}
