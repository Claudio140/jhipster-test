package de.fraunhofer.iosb.perma.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A MultiTask.
 */
@Entity
@Table(name = "multi_task")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "multitask")
public class MultiTask implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creation_time")
    private Instant creationTime;

    @Column(name = "tasking_parameter")
    private String taskingParameter;

    @OneToMany(mappedBy = "multiTask")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TaskingCapability> taskingCapabilities = new HashSet<>();
    @OneToMany(mappedBy = "multiTask")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<TaskExecution> taskExecutions = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationTime() {
        return creationTime;
    }

    public MultiTask creationTime(Instant creationTime) {
        this.creationTime = creationTime;
        return this;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public String getTaskingParameter() {
        return taskingParameter;
    }

    public MultiTask taskingParameter(String taskingParameter) {
        this.taskingParameter = taskingParameter;
        return this;
    }

    public void setTaskingParameter(String taskingParameter) {
        this.taskingParameter = taskingParameter;
    }

    public Set<TaskingCapability> getTaskingCapabilities() {
        return taskingCapabilities;
    }

    public MultiTask taskingCapabilities(Set<TaskingCapability> taskingCapabilities) {
        this.taskingCapabilities = taskingCapabilities;
        return this;
    }

    public MultiTask addTaskingCapability(TaskingCapability taskingCapability) {
        this.taskingCapabilities.add(taskingCapability);
        taskingCapability.setMultiTask(this);
        return this;
    }

    public MultiTask removeTaskingCapability(TaskingCapability taskingCapability) {
        this.taskingCapabilities.remove(taskingCapability);
        taskingCapability.setMultiTask(null);
        return this;
    }

    public void setTaskingCapabilities(Set<TaskingCapability> taskingCapabilities) {
        this.taskingCapabilities = taskingCapabilities;
    }

    public Set<TaskExecution> getTaskExecutions() {
        return taskExecutions;
    }

    public MultiTask taskExecutions(Set<TaskExecution> taskExecutions) {
        this.taskExecutions = taskExecutions;
        return this;
    }

    public MultiTask addTaskExecution(TaskExecution taskExecution) {
        this.taskExecutions.add(taskExecution);
        taskExecution.setMultiTask(this);
        return this;
    }

    public MultiTask removeTaskExecution(TaskExecution taskExecution) {
        this.taskExecutions.remove(taskExecution);
        taskExecution.setMultiTask(null);
        return this;
    }

    public void setTaskExecutions(Set<TaskExecution> taskExecutions) {
        this.taskExecutions = taskExecutions;
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
        MultiTask multiTask = (MultiTask) o;
        if (multiTask.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), multiTask.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MultiTask{" +
            "id=" + getId() +
            ", creationTime='" + getCreationTime() + "'" +
            ", taskingParameter='" + getTaskingParameter() + "'" +
            "}";
    }
}
