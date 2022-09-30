import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todoList, setTodoList] = useState(null);
  const [activeItem, setActiveItem] = useState({ id: null, title: "", completed: false });
  const [editing, setEditing] = useState(false);
  let createURL = "http://127.0.0.1:8000/api/task-create/"

  useEffect(() => {
    fetchTasks()
  }, [])

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const fetchTasks = () => {
    axios.get(`http://127.0.0.1:8000/api/task-list/`).then((response) => {
      // console.log(response.data);
      setTodoList(response.data);
    });
  };

  const handleChange = (e) => {
    var value = e.target.value
    setActiveItem({ ...activeItem, title: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    // console.log(activeItem);

    if (editing === true) {
      createURL = `http://127.0.0.1:8000/api/task-update/${activeItem.id}`;
      setEditing(false);
    }

    axios.post(`${createURL}`, activeItem, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
      .then(function (response) {
        // console.log(response.data);
        fetchTasks();
        setActiveItem({ ...activeItem, title: "" })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const startEdit = (task) => {
    console.log(task);
    setActiveItem(task)
    setEditing(true)
  }

  const deleteItem = (task) => {
    const csrftoken = getCookie('csrftoken');

    console.log(task);
    axios.delete(`http://127.0.0.1:8000/api/task-delete/${task.id}`,  {
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
      .then(function (response) {
        fetchTasks();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const strikeUnstrike = (task) => {
    const csrftoken = getCookie('csrftoken');

    task.completed = !task.completed
    console.log("Completed:", task.completed);

    createURL = `http://127.0.0.1:8000/api/task-update/${task.id}`;

    axios.post(`${createURL}`, { title: task.title, completed: task.completed }, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
      .then(function (response) {
        fetchTasks();
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  if (!todoList) return null;

  return (
    <>
      <div className='my-28 mx-[30%] bg-slate-200 p-5 shadow-xl'>
        <form onSubmit={handleSubmit} className='flex space-x-5 items-center p-2 shadow-sm' action="">
          <div>
            <input onChange={handleChange} type="text" name="title" value={activeItem.title} className='border-2 border-gray-500 outline-none p-1 w-[20rem]' />
          </div>
          <div>
            <button type="submit" className='bg-black text-white py-1.5 px-4 hover:bg-slate-700'>SUBMIT</button>
          </div>
        </form>
        <div>
          {todoList.map(function (task, index) {
            return (
              <div key={index} className="flex justify-between items-center font-semibold px-2 border-b-2 border-gray-400 hover:bg-slate-300">
                <div className="p-3 w-[80%]" onClick={() => strikeUnstrike(task)}>

                  {task.completed === false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}

                </div>
                <div className="space-x-3">
                  <button onClick={() => startEdit(task)} className="bg-gray-800 text-white px-3 py-1 hover:bg-slate-700">Edit</button>
                  <button onClick={() => deleteItem(task)} className="bg-gray-800 text-white px-3 py-1 hover:bg-slate-700">-</button>
                </div>
              </div>
            )
          }).reverse()}
        </div>

      </div>
    </>
  );
}

export default App;
