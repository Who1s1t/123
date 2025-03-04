import sys

from PyQt6.QtCore import Qt
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout, QScrollArea, QVBoxLayout

class GridWithScroll(QWidget):
    def __init__(self):
        super().__init__()

        # Создаём основное вертикальное размещение
        main_layout = QVBoxLayout(self)

        # Создаём область прокрутки
        scroll_area = QScrollArea(self)
        scroll_area.setWidgetResizable(True)

        # Создаём виджет-контейнер для содержимог
        # о
        content_widget = QWidget()
        grid = QGridLayout(content_widget)  # Применяем макет к контейнеру

        # Добавляем множество кнопок в сетку
        for row in range(10):  # 10 строк
            for col in range(10):  # 3 колонки
                grid.addWidget(QPushButton(f"Кнопка {row},{col}"), row, col)

        # Устанавливаем контейнер в область прокрутки
        scroll_area.setWidget(content_widget)
        scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOn)
        # Добавляем область прокрутки в основной макет
        main_layout.addWidget(scroll_area)

        self.setWindowTitle("QGridLayout с прокруткой")
        self.resize(400, 300)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = GridWithScroll()
    window.show()
    sys.exit(app.exec())