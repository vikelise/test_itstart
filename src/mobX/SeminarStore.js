import { makeAutoObservable } from "mobx";
import axios from "axios";

class SeminarStore {
    seminars = []; //массив с данными о семинарах
    loading = false; //флаг загрузки семинаров

    constructor() {
        makeAutoObservable(this);//применяет автоматическую реактивность ко всем свойствам и методам класса т.е. когда изменяются свойства автоматически перерисовываются компоненты использующие это состояние (SeminarList)
        this.fetchSeminars();//загружаем семинары сразу при создании класса
    }

    //получение списка семинаров
    async fetchSeminars() {
        this.loading = true;//меняем флаг обозначающий загрузку
        try {
            const response = await axios.get("https://test-itstart-api.onrender.com/seminars"); //запрос к серверу на получение списка семинаров
            this.seminars = response.data;//сохраняяем данные в свойство при успешном запросе
        } catch (error) {
            console.error("Ошибка при загрузке семинаров:", error);//если поймали ошибку выводим ее в консоль
        } finally {
            this.loading = false;//вне зависимости от успеха/неуспеха запроса меняем флаг загрузки
        }
    }

    //удаление семинара из списка
    async deleteSeminar(id) {
        await axios.delete(`https://test-itstart-api.onrender.com/seminars/${id}`);//отправляем запрос судалением на сервер
        this.seminars = this.seminars.filter(seminar => seminar.id !== id);//при успешном запросе обновляем состояние удаляя семинар из массива
    }

    //запрос на редактирование
    async editSeminar(updatedSeminar) {
        try {
            await axios.put(`https://test-itstart-api.onrender.com/seminars/${updatedSeminar.id}`, updatedSeminar); // Отправляем запрос на редактирование
            const index = this.seminars.findIndex(seminar => seminar.id === updatedSeminar.id); // Находим индекс семинара в массиве
            if (index !== -1) {
                this.seminars[index] = updatedSeminar; // Обновляем семинар в массиве
            }
        } catch (error) {
            console.error("Ошибка при обновлении семинара:", error);
        }
    }
}

const seminarStore = new SeminarStore();//создание экземпляра
export default seminarStore;//его экспорт для дальнейшего использования
