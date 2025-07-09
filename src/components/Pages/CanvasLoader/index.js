import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toolbar from '../../Toolbar';
import Toolbox from '../../Toolbox';
import Board from '../../Board';
import ToolboxProvider from '../../../store/ToolboxProvider';
import BoardProvider from "../../../store/BoardProvider";
import classes from './index.module.css';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CanvasLoader = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialElements, setInitialElements] = useState([]);

    useEffect(() => {
        const fetchCanvas = async () => {
            const token = localStorage.getItem('whiteboard_user_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/canvas/${uuid}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to load canvas');
                const data = await res.json();

                setInitialElements(data.elements);
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert('Canvas could not be loaded.');
                navigate('/profile');
            }
        };

        fetchCanvas();
    }, [uuid, navigate]);

    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <p className={classes.loadingText}>Loading canvas...</p>
            </div>
        );
    }

    return (
        <BoardProvider initialElements={initialElements}>
            <ToolboxProvider>
                <Toolbar />
                <Board />
                <Toolbox />
            </ToolboxProvider>
        </BoardProvider>
    );
};


export default CanvasLoader;
