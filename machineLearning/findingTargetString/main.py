# Python3 program to create target string, starting from 
# random string using Genetic Algorithm 

import random 

# Number of individuals in each generation 
population_size = 100
mutation_rate = 0.1
generation = 0

run = True

# Valid genes 
genes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!#%&/()=?@${[]}"

# Target string to be generated 
target = "My genetic algorithm!"

class Individual: 
    # Define Individual class
    def __init__(self, genes, target):
        self.chromosome = [self.mutate_genes(genes) for i in range(len(target))]
        self.fitness = self.cal_fitness(target)

    # Define mutation
    def mutate_genes(self, genes):
        return random.choice(genes)

    # Define mating/crossover of two parents
    def crossover(self, par2, genes, target, mutation_rate):
        child_chromosome = []
        for i in range(len(self.chromosome)):
            prob = random.random()

            if prob <= (1-mutation_rate)/2:
                child_chromosome.append(self.chromosome[i])
            elif prob > (1-mutation_rate)/2 and prob < (1-mutation_rate):
                child_chromosome.append(par2.chromosome[i])
            else:
                child_chromosome.append(self.mutate_genes(genes))
        child = Individual(genes,target)
        child.chromosome = child_chromosome
        child.fitness = child.cal_fitness(target)
        return child

    # Define fitness based on expression
    def cal_fitness(self, target):
        fitness = 0

        for i in range(len(self.chromosome)):
            if target[i] == self.chromosome[i]:
                fitness += 1
        return fitness


# main program
population = []

for i in range(population_size):
    population.append(Individual(genes, target))

while(run):
    population = sorted(population, key = lambda x:x.fitness)[::-1]

    if population[0].fitness == len(target):
        run = False
        break
    
    new_generation = []

    # top 10% population will survive and move to next generation
    s = int(10*population_size/100)
    new_generation.extend(population[:s])

    # the remaining top 90% will be randomly select for mating/crossover
    s = int(90*population_size/100) 
    for i in range(s):
        parent1 = random.choice(population[:50])
        parent2 = random.choice(population[:50])
        individual = parent1.crossover(parent2, genes, target, mutation_rate)
        new_generation.append(individual)

    population = new_generation
    generation += 1

    print("Generation: {}\t String: {}\t Fitness: {}". format(generation, "".join(population[0].chromosome), population[0].fitness))
print("Generation: {}\t String: {}\t Fitness: {}". format(generation, "".join(population[0].chromosome), population[0].fitness))
