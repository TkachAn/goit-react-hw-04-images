// Импорт React хуков для управления состоянием и побочными эффектами
import { useState, useEffect } from 'react';
// Импорт функций для работы с Pixabay API
import { apiPixabay, apiPixabayId } from '../apiPixabay/apiPixabay';
// Импорт компонентов приложения
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import ErrorView from './ErrorView/ErrorView';
import PreLoad from './preLoad/preLoad';

// Главный компонент приложения для поиска и отображения изображений
const App = () => {
  // ============ УПРАВЛЕНИЕ СОСТОЯНИЕМ ПРИЛОЖЕНИЯ ============
  
  // Хранит поисковый запрос пользователя (название картинки для поиска)
  const [query, setQuery] = useState('');
  
  // Текущий номер страницы для пагинации результатов поиска
  const [page, setPage] = useState(1);
  
  // Массив найденных изображений (накапливается при загрузке новых страниц)
  const [images, setImages] = useState([]);
  
  // URL большого изображения для отображения в модальном окне
  const [largeImageURL, setLargeImageURL] = useState('');
  
  // URL первоначального изображения, которое показывается при загрузке приложения
  const [startImageURL, setStartImageURL] = useState('');
  
  // Сообщение об ошибке (если поиск не удался или произошла ошибка)
  const [error, setError] = useState('');
  
  // Флаг для отображения/скрытия модального окна с большим изображением
  const [showModal, setShowModal] = useState(false);
  
  // Флаг, который показывает, был ли поисковый ввод пустым
  const [emptyInput, setEmptyInput] = useState(false);
  
  // Статус загрузки приложения ('idle' - ожидание, 'pending' - загрузка, 'resolved' - успех, 'rejected' - ошибка)
	const [status, setStatus] = useState('idle');
	
  // ============ ЭФФЕКТЫ ДЛЯ ЖИЗНЕННОГО ЦИКЛА КОМПОНЕНТА ============
  
  // Эффект, который выполняется при первой загрузке компонента (пустой массив зависимостей)
  // Он загружает изображение по умолчанию при старте приложения
  useEffect(() => {
    findImageId('2649311'); // ID дефолтного изображения
	}, []);
	
  // Эффект, срабатывающий когда пользователь меняет поисковый запрос или номер страницы
  // Если query пуст, функция ничего не делает. Если query не пуст, начинается поиск изображений
  useEffect(() => {
    if (query === '') {
      return; // Выход, если поле поиска пусто
    } else {
      searchImages(); // Запуск поиска с текущим query и page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  // Эффект, управляющий состоянием приложения и загруженными изображениями
  // Срабатывает при изменении emptyInput (есть ли текст в поиске) или status (статус загрузки)
  useEffect(() => {
    // Закрываем модальное окно и очищаем большое изображение при новом поиске
    setShowModal(false);
    setLargeImageURL('');
    
    // Если поле поиска НЕ пусто (пользователь ввел запрос)
    if (!emptyInput) {
      // Сбрасываем состояние в начальное
      setStatus('idle');
      setImages([]);
      setPage(1);
      setError('');
      findImageId('2649311'); // Загружаем дефолтное изображение
    } else {
      // Если поле поиска ПУСТО (пользователь очистил ввод)
      // В состоянии "ожидание" (idle) загружаем одно изображение
      if (status === 'idle') {
        findImageId('2840235'); // Другое дефолтное изображение для пустого ввода
      }
      // При ошибке (rejected) показываем еще одно изображение
      if (status === 'rejected') {
        setImages([]);
        setPage(1);
        findImageId('2681507'); // Изображение при ошибке поиска
      }
    }
  }, [emptyInput, status]);

  // ============ ФУНКЦИИ ОБРАБОТЧИКИ ============
  
  // Функция получает булев флаг, указывающий пусто ли поле ввода
  // Используется для передачи информации от компонента Searchbar к App
  const inputChange = bool => {
    setEmptyInput(bool);
  };
  
  // Функция для поиска изображений через API Pixabay
  // Принимает поисковый запрос и номер страницы из состояния
  const searchImages = async () => {
    try {
      // Отправляем запрос на API с текущим query и номером страницы
      const request = await apiPixabay(query, page);
      
      // Если это не первая страница, прокручиваем страницу вниз
      if (page > 1) scrollPage();
      
      console.log('pageQ', page); // Логируем текущую страницу для отладки
      
      // Добавляем новые изображения к существующим (не перезаписываем)
      setImages(prev => [...prev, ...request]);
      
      // Устанавливаем статус успешной загрузки
      setStatus('resolved');
      
      // Если результатов нет, показываем ошибку
      if (request.length === 0 || request === '') {
        setStatus('rejected');
        setError(`No results were found for ${query}!`); // Сообщение об ошибке с названием поиска
      }
    } catch (error) {
      // При ошибке сети или API устанавливаем статус ошибки
      setStatus('rejected');
      setError('Something went wrong. Try again.');
    } finally {
      // Блок finally выполнится в любом случае (можно добавить код очистки здесь)
    }
  };
  
  // Функция загружает изображение по его ID для отображения как дефолтное изображение
  // Используется для загрузки картинок при начале приложения или при ошибке
  const findImageId = async id => {
    try {
      // Запрашиваем изображение по ID через API
      const request = await apiPixabayId(id);
      
      // Извлекаем большое изображение и устанавливаем его как startImageURL
      setStartImageURL(request[0].largeImageURL);
      
      // Если результатов нет, устанавливаем статус ошибки
      if (request.length === 0) {
        setStatus('rejected');
        setError(`No results were found for ${id}!`);
      }
    } catch (error) {
      // При ошибке показываем сообщение об ошибке
      setError('Something went wrong.');
    } finally {
      // Блок finally для общей очистки если нужна
    }
  };
  
  // Функция обработчик формы поиска (вызывается из компонента Searchbar)
  // Параметр query - новый поисковый запрос от пользователя
  const SearchForm = query => {
    // Очищаем старые результаты поиска перед новым поиском
    setImages([]);
    // Возвращаемся на первую страницу
    setPage(1);
    // Очищаем ошибки от предыдущего поиска
    setError('');
    // Закрываем модальное окно если оно открыто
    setShowModal(false);
    // Очищаем изображение из модального окна
    setLargeImageURL('');
    // Устанавливаем новый поисковый запрос (это срабатит useEffect с query в зависимостях)
    setQuery(query);
  };
  
  // Функция для загрузки дополнительных результатов поиска (кнопка "Load More")
  // Увеличивает номер страницы на 1 для получения следующего набора изображений
  const onLoadMore = () => {
    // Устанавливаем статус "загрузка" чтобы показать Loader компонент
    setStatus('pending');
    // Увеличиваем номер страницы, что вызовет useEffect и новый запрос к API
    setPage(page + 1);
  };
  
  // Функция открытия модального окна при клике на изображение в галерее
  // Параметр e - событие клика, содержит данные об изображении
  const onOpenModal = e => {
    // Извлекаем URL большого изображения из data-атрибута (data-source)
    setLargeImageURL(e.target.dataset.source);
    // Открываем модальное окно
    setShowModal(true);
  };
  
  // Функция для переключения видимости модального окна (открыть/закрыть)
  // Инвертирует текущее значение showModal
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  // Функция плавной прокрутки страницы вниз при загрузке новых результатов
  // Нужна чтобы показать пользователю новые загруженные изображения
  const scrollPage = () => {
    // Используем setTimeout чтобы задержать прокрутку (дать время на рендер)
    setTimeout(() => {
      // Прокручиваем на высоту экрана * 2 с плавной анимацией
      window.scrollBy({
        top: document.documentElement.clientHeight * 2,
        behavior: 'smooth', // Плавная прокрутка вместо резкой
      });
    }, 500); // Задержка 500мс перед прокруткой
    
    // После прокрутки устанавливаем статус "решено" (завершено)
    setStatus('resolved');
  };
  
  // ============ УСЛОВНЫЙ РЕНДЕР В ЗАВИСИМОСТИ ОТ СТАТУСА ============
  
  // Статус 'idle' - приложение в начальном состоянии, ничего не загружается
  // Показываем только поисковую строку и дефолтное изображение при загрузке
  if (status === 'idle') {
    return (
      <>
        {/* Компонент для ввода поисковой строки */}
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        {/* <Loader /> - закомментировано, не нужно показывать загрузчик при idle */}
        {/* Компонент для отображения дефолтного/начального изображения */}
        <PreLoad src={startImageURL} />
      </>
    );
  }
  
  // Статус 'pending' - идет загрузка дополнительных результатов
  // Показываем галерею с уже загруженными изображениями и загрузчик
  if (status === 'pending') {
    return (
      <>
        {/* Поисковая строка всегда видна */}
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        {/* Показываем галерею только если это не первая страница (page > 1) */}
        {page > 1 && (
          <ImageGallery
            images={images}
            onOpenModal={onOpenModal}
            searchImages={searchImages}
          />
        )}
        {/* Показываем спиннер загрузки */}
        <Loader />
      </>
    );
  }
  
  // Статус 'rejected' - произошла ошибка при поиске (нет результатов или ошибка сети)
  // Показываем сообщение об ошибке вместо галереи
  if (status === 'rejected') {
    return (
      <>
        {/* Поисковая строка остается видна */}
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        {/* Компонент для отображения ошибки с текстом ошибки и дефолтным изображением */}
        <ErrorView textError={error} src={startImageURL} />
      </>
    );
  }
  
  // Статус 'resolved' - поиск завершен успешно, результаты загружены
  // Показываем галерею с изображениями, кнопку "Load More" и модальное окно
  if (status === 'resolved') {
    return (
      <>
        {/* Поисковая строка для нового поиска */}
        <Searchbar onSearch={SearchForm} inputChange={inputChange} />
        {/* Галерея с найденными изображениями */}
        <ImageGallery images={images} onOpenModal={onOpenModal} />
        {/* Кнопка "Load More" показывается только если изображений 12 или больше */}
        {/* (это означает что есть еще результаты для загрузки) */}
        {images.length >= 12 && <Button onLoadMore={onLoadMore} />}

        {/* Модальное окно показывается когда showModal === true */}
        {/* Отображает большую версию выбранного изображения */}
        {showModal && (
          <Modal onToggleModal={toggleModal}>
            <img src={largeImageURL} alt="largeImageURL" />
          </Modal>
        )}
      </>
    );
  }
};
// Экспортируем главный компонент App по умолчанию для использования в index.js
export default App;
