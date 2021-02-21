import React, { useState, useEffect } from 'react'
import { isEmpty, size, sortBy } from 'lodash'
import shortid from 'shortid'
import { addDocument, getCollection, updateDocument, deleteDocument } from './actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function searchingTerm(term) {
  return function(x) {
    return x.name.toLowerCase().includes(term.toLowerCase()) || !term
  }
}

function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])  
  const [editMode, setEditMode] = useState(false)
  const [id, setId] = useState("")
  const [error, setError] = useState(null)
  const [term, setTerm] = useState("")

  useEffect(() => {
    (async () => {
      const result = await getCollection("tasks")

      if(result.statusResponse) {
        setTasks(sortBy(result.data, ['name']))
      }
      
    })()
  }, [])

  const validForm = () => {
    let isValid = true
    setError(null)

    if(isEmpty(task)) {
      setError("Debes ingresar una tarea.")
      isValid = false
    }

    return isValid
  }

  const addTask = async(e) => {
    e.preventDefault()

    if(!validForm()){
      return
    }

    const result = await addDocument("tasks", { name: task })
    if(!result.statusResponse) {
      setError(result.error)
      return
    }

    setTasks([ ...tasks, { id: result.data.id, name: task }])
    setTask("")
  }

  const saveTask = async(e) => {
    e.preventDefault()

    if(!validForm()) {
      return
    }

    const result = await updateDocument("tasks", id, { name: task })
    if (!result.statusResponse) {
      setError(result.error)
      return
    } 

    const editedTasks = tasks.map(item => item.id === id ? { id, name: task } : item)
    setTasks(editedTasks)
    setEditMode(false)
    setTask("")
    setId("")
  }

  const deleteTask = async(id) => {
    const result = await deleteDocument("tasks", id)
    if (!result.statusResponse) {
      setError(result.error)
      return
    }

    const filteredTasks = tasks.filter(task => task.id !== id)
    setTasks(filteredTasks)
  }

  const editTask = (theTask) => {
    setTask(theTask.name)
    setEditMode(true)
    setId(theTask.id)
  }

  //Para agregar estilos personalizados a elementos HTML
  //Declaramos un objeto para almacenar los atributos del estilo
  /* const hoverable = {
    color: "red",
    backgroundColor: "DodgerBlue"
  } */
  //Luego le aplicamos el estilo al elemento h4 por ejemplo
  //<h4 style={hoverable}>Lista de Tareas</h4>

  return (
    <div className="App">
      <div className="container mt-5">
        <h1>Tareas</h1>
        <hr></hr>
        <div className="row">
          <div className="col-lg-8 col-xs-12">
            <h4 className="text-center">Lista de Tareas</h4>
            <input 
              type="text" 
              className="form-control mb-2" 
              placeholder="Buscar..."
              onChange={e => setTerm(e.target.value)}>
            </input>
            {
              size(tasks) == 0 ? (
                <li className="list-group-item">No hay tareas programadas.</li>
              ) : (
                <ul className="list-group">
                {
                  tasks.filter(searchingTerm(term)).map((task) => (               
                  <li className="list-group-item list-group-item-action" key={task.id}>
                    <span className="lead">{task.name}</span>
                    <button 
                      className="btn btn-danger btn-sm float-right mx-2"
                      title="Eliminar"
                      onClick={() => {
                        if(window.confirm('Eliminar esta tarea?')) {
                          deleteTask(task.id)
                        }
                      }}>
                      <span><FontAwesomeIcon icon={faTrash} /></span>
                    </button>
                    <button 
                      className="btn btn-warning btn-sm float-right"
                      title="Editar"
                      onClick={() => editTask(task)}>
                      <span><FontAwesomeIcon icon={faPencilAlt} /></span>
                    </button>
                  </li>
                  ))
                }       
              </ul>
              )            
            }
          </div>
          <div className="col-lg-4 col-xs-12">
          <h4 className="text-center">{ editMode ? "Editar Tarea" : "Agregar Tarea" }</h4>

          <form onSubmit={ editMode ? saveTask : addTask }>
            {
              error && <span className="text-danger">{error}</span>
            }
            <input 
              type="text" 
              className="form-control mb-2" 
              placeholder="Ingrese la tarea..."
              onChange={(text) => setTask(text.target.value)}
              value={task}>              
            </input>
        
            <button 
              type="submit" 
              className={ editMode ? "btn btn-warning btn-block" : "btn btn-dark btn-block" }>
              { editMode ? "Guardar" : "Agregar" }
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
