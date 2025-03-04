import sys
from PyQt6.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout




class GridExample(QWidget):
    def __init__(self):
        super().__init__()

        # Создание сеточного макета
        grid = QGridLayout()
        m = [(0,1),(1,1),(1,2),(2,0),(2,1),(2,2)]
        for i in m:
            grid.addWidget(QPushButton('Кнопка 1'), i[0], i[1])

        # # Добавление кнопок в сетку (ряд, колонка, [занимаемые ряды], [занимаемые колонки])
        # grid.addWidget(QPushButton('Кнопка 1'), 0, 0)
        # grid.addWidget(QPushButton('Кнопка 2'), 0, 1)
        # grid.addWidget(QPushButton('Кнопка 3'), 1, 0)
        # grid.addWidget(QPushButton('Кнопка 4'), 1, 1)
        # grid.addWidget(QPushButton('Большая кнопка'), 2, 0, 1, 2)  # Растянется на 2 колонки

        self.setLayout(grid)
        self.setWindowTitle("Пример QGridLayout")
        self.resize(300, 200)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = GridExample()
    window.show()
    sys.exit(app.exec())