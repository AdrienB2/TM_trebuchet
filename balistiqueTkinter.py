import tkinter as tk
from array import *
from math import *

deg_initial=0
v_initial=0
vx=0
vy=0
h_initial=0
x=0
y=0

root = tk.Tk()
root.title("Chute avec vitesse initiale")

def hauteur():
    h_initial=500-float(lthauteur.get())
    canvas.move(boulet,0,h_initial)

def initialiser():
    global deg_initial
    global v_initial
    global vx
    global vy
    deg_initial=float(ltangle.get())
    rad_initial=deg_initial*pi/180
    v_initial=float(ltvitesse.get())
    vx=v_initial*cos(rad_initial)
    vy=v_initial*sin(rad_initial)

#intervale temps pour chaque tours de simulation
dt=1
#constante g
g=9.81
#canevas
canvas = tk.Canvas(root, width=1500, height=500, bg='lavender')
canvas.pack()
#image du projectile (boulet)
boulet = canvas.create_oval(0,0,15,15, fill="yellow",outline="red")

def lancer():
    global vx
    global vy
    global x
    global y
    global h_initial
    initialiser()
    for t in range(0,30):
        dx=dt*vx
        dy=0.5*g*dt**2+g*t*dt-dt*vy
        canvas.move(boulet,dx,dy)
        canvas.after(75)
        canvas.update() 
        x+=dx 
        y+=dy 
    print("x =",x)
    print("y=",y)
    canvas.coords(boulet,0,0,15,15)


bstart = tk.Button(root, text="lancer la simulation", fg="black", command=lancer)
bstart.pack(side=tk.TOP)
bhauteur = tk.Button(root, text="changer hauteur initiale", fg="green", command=hauteur)
bhauteur.pack()

label_vitesse=tk.Label(root, text="vitesse initiale", fg="blue")
label_vitesse.pack(side=tk.LEFT)

ltvitesse = tk.Entry(root, width=10) 
ltvitesse.insert(0,'120')
ltvitesse.pack(side=tk.LEFT)

label_angle=tk.Label(root, text="angle du projectile", fg="red")
label_angle.pack(side=tk.RIGHT)

ltangle = tk.Entry(root, width=10)
ltangle.insert(0,'35')
ltangle.pack(side=tk.RIGHT)

lthauteur = tk.Entry(root, width=10)
lthauteur.insert(0,'100')
lthauteur.pack()

root.mainloop()
