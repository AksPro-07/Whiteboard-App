import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './index.module.css';




const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [selectedCanvasUuid, setSelectedCanvasUuid] = useState(null);
  const [shareStatus, setShareStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('whiteboard_user_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [userRes, canvasRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/canvas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userData = await userRes.json();
        const canvasData = await canvasRes.json();

        if (!userRes.ok || !canvasRes.ok) throw new Error();

        setUserInfo(userData);
        setCanvases(canvasData);
        setLoading(false);
      } catch (err) {
        alert('Error fetching profile info. Please login again.');
        localStorage.removeItem('whiteboard_user_token');
        navigate('/login');
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleOpenCanvas = (canvasUuid) => {
    navigate(`/canvas/${canvasUuid}`);
  };

  const handleDeleteCanvas = async (canvasUuid) => {
    const token = localStorage.getItem('whiteboard_user_token');
    try {
      await fetch(`${API_BASE_URL}/canvas`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uuid: canvasUuid }),
      });
      setCanvases((prev) => prev.filter((c) => c.uuid !== canvasUuid));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete canvas');
    }
  };

  const handleCreateCanvas = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!newCanvasName.trim()) return;

    const token = localStorage.getItem('whiteboard_user_token');
    try {
      const res = await fetch(`${API_BASE_URL}/canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCanvasName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCanvases((prev) => [data, ...prev]);
      setShowModal(false);
      setNewCanvasName('');
    } catch (err) {
      console.error('Creation failed:', err);
      alert('Failed to create canvas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('whiteboard_user_token');
    navigate('/login');
  };

  const handleOpenShareBox = (uuid) => {
    setSelectedCanvasUuid(uuid);
    setShareEmail('');
    setShareStatus('');
  };

  const handleShareSubmit = async () => {
    const token = localStorage.getItem('whiteboard_user_token');
    if (!shareEmail.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/canvas/${selectedCanvasUuid}/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail: shareEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShareStatus('Successfully shared.');
    } catch (err) {
      setShareStatus(`${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <p className={classes.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.headerRow}>
        <h1 className={classes.heading}>Welcome, {userInfo.user.name || 'User'}!</h1>
        <button className={classes.logoutButton} onClick={handleLogout}>Logout</button>
      </div>
      <p className={classes.subheading}>Here are your canvases:
        <button className={classes.createButton} onClick={handleCreateCanvas}>
          + Create Canvas
        </button>
      </p>

      {showModal && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <h3 className={classes.modalTitle}>Enter Canvas Name</h3>
            <input
              type="text"
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
              className={classes.modalInput}
              placeholder="Canvas name"
            />
            <div className={classes.modalActions}>
              <button className={classes.modalSubmit} onClick={handleModalSubmit}>
                Create
              </button>
              <button className={classes.modalCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCanvasUuid && (
        <div className={classes.modalOverlay}>
          <div className={classes.modal}>
            <h3 className={classes.modalTitle}>Share Canvas</h3>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className={classes.modalInput}
              placeholder="Enter email address"
            />
            <div className={classes.modalActions}>
              <button className={classes.modalSubmit} onClick={handleShareSubmit}>Share</button>
              <button className={classes.modalCancel} onClick={() => setSelectedCanvasUuid(null)}>Cancel</button>
            </div>
            {shareStatus && <p className={classes.statusMessage}>{shareStatus}</p>}
          </div>
        </div>
      )}

      <div className={classes.canvasList}>
        {canvases.length === 0 ? (
          <p className={classes.noCanvasText}>No canvas created yet. Click above to get started!</p>
        ) : (
          canvases.map((canvas) => (
            <div key={canvas.uuid} className={classes.canvasCard}>
              <div className={classes.canvasInfo} onClick={() => handleOpenCanvas(canvas.uuid)}>
                <p className={classes.canvasName}>{canvas.name}</p>
                <div className={classes.canvasTimeInfo}>
                  <div className={classes.timeStamp}>
                    Updated At : {new Date(canvas.updatedAt).toLocaleString()}
                  </div>
                  <div className={classes.timeStamp}>
                    Created On : {new Date(canvas.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className={classes.buttonGroup}>
                <button className={classes.shareButton} onClick={() => handleOpenShareBox(canvas.uuid)}>Share</button>
                <button className={classes.deleteButton} onClick={() => handleDeleteCanvas(canvas.uuid)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
