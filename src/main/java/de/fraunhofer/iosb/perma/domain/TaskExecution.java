package de.fraunhofer.iosb.perma.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A TaskExecution.
 */
@Entity
@Table(name = "task_execution")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskexecution")
public class TaskExecution implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jhi_timestamp")
    private Instant timestamp;

    @ManyToOne
    @JsonIgnoreProperties("taskExecutions")
    private MultiTask multiTask;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public TaskExecution timestamp(Instant timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public MultiTask getMultiTask() {
        return multiTask;
    }

    public TaskExecution multiTask(MultiTask multiTask) {
        this.multiTask = multiTask;
        return this;
    }

    public void setMultiTask(MultiTask multiTask) {
        this.multiTask = multiTask;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TaskExecution taskExecution = (TaskExecution) o;
        if (taskExecution.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), taskExecution.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TaskExecution{" +
            "id=" + getId() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
