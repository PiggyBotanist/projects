# Completion date: 2019.10.23
# Written by: Jeremy Chang

# Purpose: to automate BCA pierce analysis that has been routely conducted in our lab
# Protocol: https://assets.thermofisher.com/TFS-Assets/LSG/manuals/MAN0011430_Pierce_BCA_Protein_Asy_UG.pdf

import os
import openpyxl as xl
import numpy as np
from scipy import stats
from datetime import date
import matplotlib.pyplot as plt
import functions as f

# load all files within the directory & identify the name of the Excel file.
files = os.listdir('.')
for file in files:
    if ".xlsx" in file:
        excelName = file

# define the Excel file & activate the worksheet.
excelFile = xl.load_workbook(f"{excelName}")
sh = excelFile.active


# load all values from excel file.
repeats = f.load_single_value((2,16),sh)
dilution_factor = f.load_single_value((3,16),sh)
standard_curve_od_matrix = f.load_value((2,2),(8,repeats),sh)
unknown_sample_od_matrix = f.load_value((2,2+repeats),(8,12-repeats),sh)
standard_concentration = np.reshape(np.transpose(f.load_value((13,1),(8,1),sh)), (8,))

# load the corrector.
corrector = f.find_corrector(standard_curve_od_matrix,repeats,sh)

# correct the values.
standard_curve_od_matrix = standard_curve_od_matrix - corrector
standard_curve_od_matrix = f.nullify_negatives(standard_curve_od_matrix)
standard_curve_od_matrix = np.mean(standard_curve_od_matrix, axis = 1)
unknown_sample_od_matrix = unknown_sample_od_matrix - corrector
unknown_sample_od_matrix = f.nullify_negatives(unknown_sample_od_matrix)

# calculate slope, intercept, r, p and standard error
slope, intercept, r, p, std_err = stats.linregress(standard_concentration, standard_curve_od_matrix)

# calculate the protein concentration
protein_concentration = f.extrapolate(unknown_sample_od_matrix,slope, intercept,dilution_factor)

# output results
f.output_value((24,2), (8,12), np.zeros((8,12)), sh)
f.output_value((24,2 + repeats), (8,12 - repeats), protein_concentration, sh)
f.output_single_value((34,2),slope,sh)
f.output_single_value((35,2),intercept,sh)
f.output_single_value((36,2),r,sh)
f.output_single_value((37,2),p,sh)
f.output_single_value((38,2),std_err,sh)

# save all modification made in Excel file
excelFile.save(f"{excelName}")

# graph the BCa standard curve
theta = np.polyfit(standard_concentration,standard_curve_od_matrix,1)
line_of_best_fit = theta[1] + theta[0]*standard_concentration
plt.scatter(standard_concentration, standard_curve_od_matrix)
plt.plot(standard_concentration, line_of_best_fit)
plt.title("BCA Standard Curve ")
plt.xlabel("Concentration(mg/mL)")
plt.ylabel("Optical Density(OD)")
plt.show()
