import pygame
pygame.init()
win = pygame.display.set_mode((500, 500))
pygame.display.set_caption = ("Trébuchet")

positions = [
    [0.0, 0.0, 10.0],
    [0.1, 0.5, 10.485985714285714],
    [0.2, 1.0, 10.943942857142858],
    [0.3, 1.5, 11.373871428571428],
    [0.4, 2.0, 11.775771428571428],
    [0.5, 2.5, 12.149642857142856],
    [0.6, 3.0, 12.495485714285714],
    [0.7, 3.5, 12.8133],
    [0.8, 4.0, 13.103085714285713],
    [0.9, 4.5, 13.364842857142857],
    [1.0, 5.0, 13.598571428571429],
    [1.1, 5.5, 13.804271428571429],
    [1.2, 6.0, 13.981942857142858],
    [1.3, 6.5, 14.131585714285714],
    [1.4, 7.0, 14.2532],
    [1.5, 7.5, 14.346785714285714],
    [1.6, 8.0, 14.412342857142857],
    [1.7, 8.5, 14.449871428571429],
    [1.8, 9.0, 14.459371428571428],
    [1.9, 9.5, 14.440842857142858],
    [2.0, 10.0, 14.394285714285715],
    [2.1, 10.5, 14.3197],
    [2.2, 11.0, 14.217085714285712],
    [2.3, 11.5, 14.086442857142858],
    [2.4, 12.0, 13.927771428571429],
    [2.5, 12.5, 13.741071428571429],
    [2.6, 13.0, 13.526342857142856],
    [2.7, 13.5, 13.283585714285712],
    [2.8, 14.0, 13.0128],
    [2.9, 14.5, 12.713985714285714],
    [3.0, 15.0, 12.387142857142857],
    [3.1, 15.5, 12.032271428571427],
    [3.2, 16.0, 11.649371428571426],
    [3.3, 16.5, 11.238442857142859],
    [3.4, 17.0, 10.799485714285716],
    [3.5, 17.5, 10.3325],
    [3.6, 18.0, 9.837485714285712],
    [3.7, 18.5, 9.314442857142854],
    [3.8, 19.0, 8.763371428571428],
    [3.9, 19.5, 8.184271428571428],
    [4.0, 20.0, 7.5771428571428565],
    [4.1, 20.5, 6.941985714285714],
    [4.2, 21.0, 6.278799999999997],
    [4.3, 21.5, 5.587585714285716],
    [4.4, 22.0, 4.868342857142853],
    [4.5, 22.5, 4.121071428571426],
    [4.6, 23.0, 3.3457714285714317],
    [4.7, 23.5, 2.542442857142852],
    [4.8, 24.0, 1.7110857142857157],
    [4.9, 24.5, 0.8516999999999939]
]

for i in positions:
    pygame.draw.circle(win, (0, 255, 0), (i[1]*10, 0-i[2]*10), 1)
    pygame.display.update()
    pygame.time.delay(100)

# t = 0
# vxi = 5
# vyi = 5
# xi = 0
# yi = 10
# a = (-9.81) / 3.5
# positions = []
# for i in range(50):
#     t = i/10
#     x = xi + vxi * t
#     y = yi + vyi * t + 0.5 * a * t ** 2
#     positions.append([t, x, y])
# print(positions)