import numpy as np
import requests
import random

OSRM_URL = "https://router.project-osrm.org/table/v1/driving/"


def make_distance_matrix(coordinates):
    coord_string = ";".join([f"{lon},{lat}" for lat, lon in coordinates])
    request_url = f"{OSRM_URL}{coord_string}"
    response = requests.get(request_url)

    if response.status_code != 200:
        raise Exception(f"OSRM request failed with status code {response.status_code}")

    data = response.json()
    distance_matrix = data["durations"]
    return distance_matrix

def create_initial_population(size, num_stops):
    return [random.sample(range(num_stops), num_stops) for _ in range(size)]

def total_duration(route, distance_matrix):
    return sum(distance_matrix[route[i]][route[i+1]] for i in range(len(route)-1)) + distance_matrix[route[-1]][route[0]]

def tournament_selection(population, fitness, k=3):
    selected = random.sample(range(len(population)), k)
    best = min(selected, key=lambda i: fitness[i])
    return population[best]

def ordered_crossover(parent1, parent2):
    size = len(parent1)
    start, end = sorted(random.sample(range(size), 2))
    child = [-1] * size
    child[start:end] = parent1[start:end]

    pos = end
    for coord in parent2:
        if coord not in child:
            if pos >= size:
                pos = 0
            child[pos] = coord
            pos += 1
    return child

def swap_mutation(route, mutation_rate):
    if random.random() < mutation_rate:
        a, b = random.sample(range(len(route)), 2)
        route[a], route[b] = route[b], route[a]
    return route

def two_opt(route, distance_matrix):
    best = route
    best_time = total_duration(route, distance_matrix)
    for i in range(len(route)-1):
        for j in range(i+2, len(route)):
            new_route = route[:i] + route[i:j+1][::-1] + route[j+1:]
            new_time = total_duration(new_route, distance_matrix)
            if new_time < best_time:
                best_time = new_time
                best = new_route
    return best

def genetic_tsp(coordinates, population_size=100, generations=500, mutation_rate=0.1):
    try:
        distance_matrix = make_distance_matrix(coordinates)
    except:
        raise Exception(f"Could not generate distance matrix")
    num_stops = len(distance_matrix)
    population = create_initial_population(population_size, num_stops)

    for _ in range(generations):
        fitness = [total_duration(route, distance_matrix) for route in population]
        new_population = []

        for _ in range(population_size // 2):
            parent1 = tournament_selection(population, fitness)
            parent2 = tournament_selection(population, fitness)
            child1 = ordered_crossover(parent1, parent2)
            child2 = ordered_crossover(parent2, parent1)
            new_population += [swap_mutation(child1, mutation_rate), swap_mutation(child2, mutation_rate)]

        population = new_population
        best_index = np.argmin(fitness)
        population[best_index] = two_opt(population[best_index], distance_matrix)

    best_route = min(population, key=lambda r: total_duration(r, distance_matrix))
    return best_route