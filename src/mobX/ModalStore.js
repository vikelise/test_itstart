import { makeAutoObservable } from "mobx";

class ModalStore {
    isDeleteModalOpen = false;//флаг отображающий открытие модального окна удаления
    isEditModalOpen = false;//флаг открытия окна редактирования
    selectedSeminar = null; //хранит выбранный семинар для редактирования

    constructor() {
        makeAutoObservable(this);//применяет автоматическую реактивность ко всем свойствам и методам класса т.е. когда изменяются свойства автоматически перерисовываются компоненты использующие это состояние (SeminarList)
    }

    //открытие модального окна удаления
    openDeleteModal(seminar) {
        this.selectedSeminar = seminar;//сохраняем выбранный семинар
        this.isDeleteModalOpen = true;//меняем флаг
    }

    //закрытие модального окна удаления
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.selectedSeminar = null;
    }

    //открытие модального окна редактирования
    openEditModal(seminar) {
        this.selectedSeminar = seminar;
        this.isEditModalOpen = true;
    }

    //закрытие модального окна редактирования
    closeEditModal() {
        this.isEditModalOpen = false;
        this.selectedSeminar = null;
    }
}

const modalStore = new ModalStore();//создание нового экземпляра состояния модальных окон
export default modalStore;
