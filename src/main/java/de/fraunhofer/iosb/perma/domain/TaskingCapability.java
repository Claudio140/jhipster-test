package de.fraunhofer.iosb.perma.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A TaskingCapability.
 */
@Entity
@Table(name = "tasking_capability")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "taskingcapability")
public class TaskingCapability implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "tasking_parameters")
    private String taskingParameters;

    @Column(name = "properties")
    private String properties;

    @ManyToOne
    @JsonIgnoreProperties("taskingCapabilities")
    private Actor actor;

    @ManyToOne
    @JsonIgnoreProperties("taskingCapabilities")
    private MultiTask multiTask;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public TaskingCapability name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public TaskingCapability description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTaskingParameters() {
        return taskingParameters;
    }

    public TaskingCapability taskingParameters(String taskingParameters) {
        this.taskingParameters = taskingParameters;
        return this;
    }

    public void setTaskingParameters(String taskingParameters) {
        this.taskingParameters = taskingParameters;
    }

    public String getProperties() {
        return properties;
    }

    public TaskingCapability properties(String properties) {
        this.properties = properties;
        return this;
    }

    public void setProperties(String properties) {
        this.properties = properties;
    }

    public Actor getActor() {
        return actor;
    }

    public TaskingCapability actor(Actor actor) {
        this.actor = actor;
        return this;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public MultiTask getMultiTask() {
        return multiTask;
    }

    public TaskingCapability multiTask(MultiTask multiTask) {
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
        TaskingCapability taskingCapability = (TaskingCapability) o;
        if (taskingCapability.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), taskingCapability.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TaskingCapability{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", taskingParameters='" + getTaskingParameters() + "'" +
            ", properties='" + getProperties() + "'" +
            "}";
    }
}
