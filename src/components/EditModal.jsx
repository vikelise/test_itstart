import React, {useState, useCallback} from 'react';
import '../styles/EditModal.css';

const EditModal = ({ seminar, onClose, onConfirm }) =>  {
    //переменные состояния для частей формы, в которых либо значения из api (если они есть) или ничего + перемеменные состояния для ошибок
    const [seminarName, setSeminarName] = useState(seminar.title || '');
    const [seminarDescription, setSeminarDescription] = useState(seminar.description || '');
    const [seminarDate, setSeminarDate] = useState(() => {
        const date = seminar.date;
        if (!date) return ''; // если даты нет, возвращаем пустую строку

        const [day, month, year] = date.split('.'); // разделяем строку по точкам
        const parsedDate = new Date(Date.UTC(year, month - 1, day)); // создаем объект Date в UTC чтобы не было смещения по дням; у месяца вычитаем 1 потому что нумерация месяцев в js начинается с 0

        return parsedDate.toISOString().split('T')[0]; // преобразуем в формат YYYY-MM-DD
    });
    const [seminarTime, setSeminarTime] = useState(seminar.time || '');
    const [seminarPhoto, setSeminarPhoto] = useState(seminar.photo || '');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({
        seminarName: false,
        seminarPhoto: false,
        seminarDescription: false,
        seminarDate: false,
        seminarTime: false,
    });

    //функция приведения даты к формату который в api
    const formatDateToDDMMYYYY = (dateString) => {
        const [year, month, day] = dateString.split('-'); // разбиваем строку по дефисам
        return `${day}.${month}.${year}`; // собираем в формате DD.MM.YYYY
    };

    // логика сохранения изменений
    const handleSave = () => {
        // сброс всех ошибок перед проверкой
        setError('');
        setFormErrors({
            seminarName: false,
            seminarPhoto: false,
            seminarDescription: false,
            seminarDate: false,
            seminarTime: false,
        });

        // проверка каждого поля на пустоту
        const newFormErrors = {
            seminarName: !seminarName.trim(),
            seminarPhoto: !seminarPhoto,
            seminarDescription: !seminarDescription.trim(),
            seminarDate: !seminarDate,
            seminarTime: !seminarTime,
        };

        //если хотя бы одно поле пустое
        if (Object.values(newFormErrors).some(Boolean)) {
            setFormErrors(newFormErrors);// обновляем состояние ошибок
            setError('Все поля должны быть заполнены');//показываем сообщение об ошибке
            return;
        }

        const formattedDate = formatDateToDDMMYYYY(seminarDate);//меняем формат даты для сохранения

        // создаем объект с обновленными данными
        const updatedSeminar = {
            id: seminar.id,
            title: seminarName,
            description: seminarDescription,
            date: formattedDate,//здесь важно сохранять дату в правильном формате
            time: seminarTime,
            photo: seminarPhoto,
        }

        // вызываем onConfirm с обновленным объектом
        onConfirm(updatedSeminar);
        console.log(`Сохранен объект: ${updatedSeminar}`);
    };

    //загрузка изображения черех проводник
    const handleFileChange = (event) => {
        //проверяем что файл является изображением
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setError('Используйте правильный формат для изображения (JPG, PNG, SVG)');
                return;
            }
            const imageUrl = URL.createObjectURL(file); // Создаем URL для изображения
            setSeminarPhoto(imageUrl);//сохраняем значение в переменную состояния
        }
    };

    //загрузка изображения через перетаскивание
    const handleDrop = useCallback((event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение
        //проверка что файл является изображением
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setError('Используйте правильный формат для изображения (JPG, PNG, SVG)');
                return;
            }
            const imageUrl = URL.createObjectURL(file); // Создаем URL для изображения
            setSeminarPhoto(imageUrl);//сохраняем значение в переменную состояния
        }
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Редактирование семинара</h2>
                <div className="form">
                    <div className="form-item">
                        <p>Название:</p>
                        <textarea value={seminarName}
                                  onChange={(e) => setSeminarName(e.target.value)}//при изменинии сохраняем значение в переменную состояния
                                  placeholder="введите название"
                                  className={formErrors.seminarName ? "error" : undefined}//меняем стили в зависимости от наличия ошибок
                        />
                    </div>
                    <div className="form-item">
                        <p>Описание:</p>
                        <textarea value={seminarDescription}
                                  onChange={(e) => setSeminarDescription(e.target.value)}
                                  placeholder="введите описание"
                                  className={formErrors.seminarDescription ? "error" : undefined}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="date-input">Дата:</label>
                        <input
                            type="date"
                            value={seminarDate}
                            onChange={(e) => setSeminarDate(e.target.value)}
                            id="date-input"
                            className={formErrors.seminarDate ? 'error' : ''}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="time-input">Время:</label>
                        <input
                            type="time"
                            value={seminarTime}
                            onChange={(e) => setSeminarTime(e.target.value)}
                            id="time-input"
                            className={formErrors.seminarTime ? 'error' : ''}
                        />
                    </div>

                    <div
                        className={formErrors.seminarPhoto ? "error-upload-container" : "upload-container"}
                        onDragOver={(e) => e.preventDefault()}//отменяем стандартное поведение при перетаскивании файла
                        onDrop={handleDrop}//обработчик события drop (перетаскивания файла)
                        onClick={() => document.getElementById('file-input')?.click()}//при клики открывается проводник для выбора файла
                    >
                        <p>Перетащите фотографию сюда или кликните, чтобы выбрать файл</p>
                        <input
                            type="file"
                            id="file-input"
                            accept="image/*"//ограничиваем выбор файла изображениями
                            onChange={handleFileChange}//обработчик изменения
                            className="upload-input"
                        />
                    </div>
                    {seminarPhoto && ( //если загруженное изображение есть выводим его
                        <div className="uploaded-photo-container">
                            <p><b>Загруженое изображение:</b></p>
                            <img src={seminarPhoto} alt="photo" className="uploaded-photo"/>
                        </div>
                    )}
                </div>
                {//вывод ошибок если они есть
                    error && <div className="error-message">{error}</div>
                }
                <div className="modal-buttons-container">
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={onClose}>Отмена</button>
                </div>
            </div>

        </div>

    );
};

export default EditModal;
