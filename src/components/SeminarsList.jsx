import React from "react";
import {observer} from "mobx-react";
import seminarStore from "../mobX/SeminarStore";
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import modalStore from '../mobX/ModalStore';
import "../styles/SeminarList.css";

const SeminarsList = observer(() => {//обозначаем что этот компонент должен реагировать на изменения в MobX-хранилище (атоматически изменяться при измениние данных)
    //удаление семинара
    const handleConfirmDelete = () => {
        if (modalStore.selectedSeminar) {//проверка выбран ли семинар для удаления
            seminarStore.deleteSeminar(modalStore.selectedSeminar.id); //удаление семинара из хранилища
            console.log("Семинар удален:", modalStore.selectedSeminar.id);
        }
        modalStore.closeDeleteModal();//закрываем модальное окно
    };

    //редактирование семинара
    const handleConfirmEdit = (updatedSeminar) => {
        if (updatedSeminar) {//проверка существования семинара для редактирования
            seminarStore.editSeminar(updatedSeminar); //обновление семинара в хранилище
            console.log("Семинар добавлен:", modalStore.selectedSeminar);
        }
        modalStore.closeEditModal();//закрываем модальное окно
    };

    return (
        <div className="main-container">
            <h1>Семинары</h1>
            {seminarStore.loading ? (//если список семинаров загружается отображаем gif загрузки
                <div className="loading-error-img-container">
                    <img src={require('../images/loading.gif')} alt="Loading GIF" className="loading-error-img"/>
                </div>
            ) : ( //если список семинаров загрузился
                <ul>
                    {seminarStore.seminars.map((seminar) => (//проходимся по списку и выводим информацию про каждый семинар
                        <li key={seminar.id} className="seminar-item">
                            <img src={seminar.photo} alt="photo"/>
                            <div className="seminar-info">
                                <div>{seminar.title}</div>
                                <div className="seminar-time-date-container">
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="bi bi-clock-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                                        </svg>
                                        {seminar.time}
                                    </div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             className="bi bi-calendar-check-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
                                        </svg>
                                        {seminar.date}
                                    </div>
                                </div>
                                <div>{seminar.description}</div>
                                <div className="seminar-buttons-container">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="bi bi-pencil-fill" viewBox="0 0 16 16"
                                         onClick={() => modalStore.openEditModal(seminar)}
                                    >
                                        <path
                                            d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         className="bi bi-trash3-fill" viewBox="0 0 16 16"
                                         onClick={() => modalStore.openDeleteModal(seminar)}
                                    >
                                        <path
                                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                    </svg>

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {modalStore.isDeleteModalOpen && (//проверяем если пользователь открыл модальное окно удаления монтируем это компонет
                <DeleteModal//не забываем передать необходимые значения(пропсы): выбранный семинар, функции выхода с сохранением и без
                    seminar={modalStore.selectedSeminar}
                    onClose={()=> modalStore.closeDeleteModal()}
                    onConfirm={handleConfirmDelete}
                />
            )}
            {modalStore.isEditModalOpen && (//проверяем если пользователь открыл модальное окно редактирования монтируем этот компонет
                <EditModal
                    seminar={modalStore.selectedSeminar}
                    onClose={()=> modalStore.closeEditModal()}
                    onConfirm={handleConfirmEdit}
                />
            )}
        </div>
    );
});

export default SeminarsList;
