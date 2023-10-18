import math

# returns F1, F2
def gravitational_force(m1, m2, p1, p2):
    G = 5#6.6743*10**(-11)
    r_square = (p1[0]*p2[0])**2 + (p1[1]*p2[1])**2
    F = G*m1*m2/r_square
    #print("F: ", F)

    # Direction of force for m1 and m2
    v1 = [(p2[0]-p1[0]),(p2[1]-p1[1])]
    #print("v1: ", v1)
    v2 = [(p1[0] - p2[0]), (p1[1] - p2[1])]
    #print("v2: ", v2)
    v_mag = math.sqrt(r_square)

    # Unit vector of v1 and v2
    u1 = [v1[0]/v_mag,v1[1]/v_mag]
    #print("u1: ", u1)
    u2 = [v2[0]/v_mag,v2[1]/v_mag]
    #print("u1: ", u2)

    # Find Force F1 = force on m1, F2 = force on m2
    F1 = [u1[0]*F,u1[1]*F]
    #print("F1: ", F1)
    F2 = [u2[0]*F,u2[1]*F]
    #print("F2: ", F2)

    return F1 #, F2

def sum_force(F1, F2):
    F = [F1[0]+F2[0], F1[1]+F2[1]]
    return F


# input a list of mass and a list of position
def get_forces(mass, position):
    F = [[0,0]]*len(mass)
    #print(F)
    for i in range(0,len(mass)):
        for j in range(0,len(mass)):
            if i != j:
                F1 = gravitational_force(mass[i], mass[j], position[i], position[j])
                F[i] = [F[i][0] + F1[0], F[i][1] + F1[1]]
    return F

# all in a list
def get_a_v_p(a,v,p,m,F,t1,t2):
    for i in range(0,len(v)):
        for j in range(0, len(v[0])):
            a[i][j] = F[i][j]/m[i]*(t2-t1) + a[i][j]
            v[i][j] = v[i][j]*(t2-t1) + a[i][j]
            p[i][j] = p[i][j] + v[i][j]
    return a, v, p

