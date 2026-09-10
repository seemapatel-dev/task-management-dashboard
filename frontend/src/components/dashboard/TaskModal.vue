```vue
<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'save',
  'close'
])

const errors = ref({})

const form = reactive({
  title: '',
  description: '',
  project: 'Frontend',
  priority: 'medium',
  status: 'active',
  due: ''
})

watch(
  () => props.task,
  task => {
    errors.value = {}

    if (task) {
      Object.assign(form, {
        title: task.title || '',
        description: task.description || '',
        project: task.project || 'Frontend',
        priority: task.priority || 'medium',
        status: task.status || 'active',
        due: task.due || ''
      })
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  form.title = ''
  form.description = ''
  form.project = 'Frontend'
  form.priority = 'medium'
  form.status = 'active'
  form.due = ''
}

function validate() {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Task title is required.'
  } else if (form.title.trim().length < 3) {
    errors.value.title = 'Title must contain at least 3 characters.'
  }

  if (!form.description.trim()) {
    errors.value.description = 'Description is required.'
  }

  if (!form.due.trim()) {
    errors.value.due = 'Due date is required.'
  }

  return Object.keys(errors.value).length === 0
}

function submitForm() {
  if (!validate()) return

  emit('save', {
    ...(props.task || {}),
    title: form.title.trim(),
    description: form.description.trim(),
    project: form.project,
    priority: form.priority,
    status: form.status,
    due: form.due.trim()
  })
}

function closeModal() {
  emit('close')
}
</script>

<template>
  <div
    class="overlay"
    @click.self="closeModal"
  >
    <div class="modal">

      <div class="modal-header">

        <div>
          <p>
            {{ task ? 'EDIT TASK' : 'NEW TASK' }}
          </p>

          <h2>
            {{ task ? 'Update task' : 'Create a task' }}
          </h2>
        </div>

        <button
          class="close"
          aria-label="Close"
          @click="closeModal"
        >
          ×
        </button>

      </div>

      <form @submit.prevent="submitForm">

        <label>
          Task title

          <input
            v-model="form.title"
            placeholder="e.g. Build authentication API"
            :class="{ error: errors.title }"
          />

          <small v-if="errors.title">
            {{ errors.title }}
          </small>
        </label>

        <label>
          Description

          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Describe what needs to be done..."
            :class="{ error: errors.description }"
          ></textarea>

          <small v-if="errors.description">
            {{ errors.description }}
          </small>
        </label>

        <div class="row">

          <label>
            Project

            <select v-model="form.project">
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
              <option>Documentation</option>
            </select>
          </label>

          <label>
            Priority

            <select v-model="form.priority">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

        </div>

        <div class="row">

          <label>
            Status

            <select v-model="form.status">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label>
            Due date

            <input
              v-model="form.due"
              placeholder="Sep 20"
              :class="{ error: errors.due }"
            />

            <small v-if="errors.due">
              {{ errors.due }}
            </small>
          </label>

        </div>

        <div class="footer">

          <button
            type="button"
            class="cancel"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="save"
          >
            {{ task ? 'Save Changes' : 'Create Task' }}
          </button>

        </div>

      </form>

    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;

  padding: 20px;

  background: rgba(20, 25, 40, .45);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 100;

  overflow-y: auto;
}

.modal {
  width: 100%;
  max-width: 600px;

  max-height: calc(100vh - 40px);

  overflow-y: auto;

  background: white;

  border-radius: 18px;

  padding: 26px;

  box-shadow: 0 30px 80px rgba(20, 25, 40, .25);
}

.modal-header {
  display: flex;
  justify-content: space-between;

  margin-bottom: 22px;
}

.modal-header p {
  margin: 0 0 5px;

  color: #5b5ce2;

  font-size: 11px;
  font-weight: 800;
}

.modal-header h2 {
  margin: 0;

  color: #252b38;

  font-size: 22px;
}

.close {
  width: 32px;
  height: 32px;

  border: none;
  border-radius: 8px;

  background: #f2f3f6;

  font-size: 21px;
  color: #667084;

  cursor: pointer;
}

.close:hover {
  background: #e8e9ee;
}

form {
  display: grid;
  gap: 15px;
}

label {
  display: grid;
  gap: 7px;

  color: #596276;

  font-size: 12px;
  font-weight: 700;
}

input,
textarea,
select {
  box-sizing: border-box;

  width: 100%;

  padding: 11px 12px;

  border: 1px solid #dfe3eb;
  border-radius: 9px;

  background: #fafbfe;

  outline: none;

  font-family: inherit;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #8586e8;
}

input.error,
textarea.error {
  border-color: #d34f4f;
}

small {
  color: #d34f4f;
  font-size: 11px;
}

.row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 8px;
}

.cancel,
.save {
  border: none;

  padding: 10px 16px;

  border-radius: 9px;

  font-weight: 700;

  cursor: pointer;
}

.cancel {
  background: #f1f2f5;
  color: #5d6678;
}

.cancel:hover {
  background: #e7e8ed;
}

.save {
  background: #5b5ce2;
  color: white;
}

.save:hover {
  background: #4d4ecf;
}

@media (max-width: 550px) {
  .overlay {
    padding: 10px;
  }

  .modal {
    max-height: calc(100vh - 20px);
    padding: 20px;
    border-radius: 14px;
  }

  .row {
    grid-template-columns: 1fr;
  }

  .footer {
    flex-direction: column-reverse;
  }

  .cancel,
  .save {
    width: 100%;
    min-height: 42px;
  }
}
</style>
```
