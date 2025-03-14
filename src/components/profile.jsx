import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.envREACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      axios.get(`${API_URL}/api/tasks/${selectedEmail}`)
        .then(response => setTasks(response.data))
        .catch(error => console.error("Error fetching tasks:", error));
    } else {
      setTasks([]);
    }
  }, [selectedEmail]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedEmail) {
      alert("Please enter a task and select a user.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        title: newTask,
        email: selectedEmail,
      });
      setTasks([...tasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setUpdatedTitle(task.title);
  };

  const handleUpdateTask = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, {
        title: updatedTitle,
      });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <motion.div 
      className="w-screen min-h-screen bg-gray-900 text-white p-8 flex justify-center items-center"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
  {selectedEmail ? `❤️📧 ${selectedEmail} 🎯✅` : "👤 User Profile"}
</h2>

          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Filter by User Email:</label>
          <select onChange={(e) => setSelectedEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg">
            <option value="">Select an Email</option>
            {users.map(user => <option key={user.email} value={user.email}>{user.email}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task..." className="w-full p-3 bg-gray-700 rounded-lg mb-2" />
          <button onClick={handleAddTask} className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
            Add Task
          </button>
        </div>

        <motion.div 
          className="mt-6"
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4">Tasks</h3>
          {tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map(task => (
                <motion.li 
                  key={task._id} 
                  className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  {editingTask === task._id ? (
                    <input 
                      type="text" 
                      value={updatedTitle} 
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="p-2 bg-gray-600 rounded-lg mr-2" 
                    />
                  ) : (
                    <span>{task.title}</span>
                  )}

                  <div className="flex space-x-2">
                    {editingTask === task._id ? (
                      <button onClick={() => handleUpdateTask(task._id)} className="bg-green-500 px-3 py-1 rounded">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => handleEditTask(task)} className="bg-yellow-500 px-3 py-1 rounded">
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p>No tasks available for the selected user.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
