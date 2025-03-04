import React from 'react';
import '../styles/DeleteModal.css'; // Импортируйте стили для модального окна

const DeleteModal = ({ seminar, onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>Вы уверены, что хотите удалить семинар "{seminar?.title}"?</p>
                <div className="modal-buttons-container">
                <button onClick={onConfirm}>Да</button>
                <button onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
