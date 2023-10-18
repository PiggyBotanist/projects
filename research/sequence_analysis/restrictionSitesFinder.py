# Assignment #2 - Restriction Enzymes
# By: Jeremy Chang
# Date: November 02, 2022

# Description:
# - All variables in this program have a one letter code in the front representing the data type.
#   (for example: a string will have s in the beginning, an integer will have i in the front)

# Requirement:
# two .txt file one containing the restriction enzyme, while the other one containing sequence of interest

#enzyme.txt:
EcoRI;G%AATTC
BamHI;G%GATCC
PstI;CTGCA%G
AluI;AG%CT

#test.fas
>TESTSEQ
ATTATAAAATTAAAATTATATCCAATGAATTCAATTAAATTAAATTAAAGAATTCAATAATATACCCCGGGGGGATCCAATTAAAAGCTAAAAAAAAAAAAAAAAAA

# Function #1 (Find restriction sites from the target sequence.)
# - input value include sequence to cut (sTS), sequence to the left of the cleavage site (sLC),
#   and sequence to the right of cleavage site (sRC).
# - output the position of cleave site as an array (aR).
def findResrictionSite(sTS,sRC,sLC):
    es = sRC + sLC                    # Enzyme Sequence (es) = the full sequence for cleavage (rc + lc)
    aR = []                           # Initialize output array (aR)
    for i in range(len(sTS)):         # loop through entire sequence and find sequence that matches restriction sequence
        if sTS[i: i + len(es)] == es:
            aR.append(i + len(sRC)-1) # add the location of cutting site to the final output array
    return aR                         # return the result

# Function #2 (Generate the sequence with restriction sites identified.)
# - input value include target sequence(sTS), cleavage sites(aC).
# - output the fragmented sequence as an array(aR)
def fragmentor(sTS,aC):
    aR = []                                             # Initialize output array (aR)
    if len(aC) > 0:                                     # Only fragment it if there is cutting site
        aR.append(sTS[0 : aC[0] + 1])                   # Add first fragment
        for i in range(1, len(aC)):
            aR.append(sTS[aC[i-1] + 1 : aC[i] + 1])     # Add fragment in between
        aR.append(sTS[aC[len(aC)-1] + 1 : len(sTS)])      # Add last fragment
    return(aR)                                          # Return final result

# Function #3 - (Add space into fragmented sequence every 10 base pair)
# - input value includes array of fragmented sequences(sS)
# - output the result with space in between.
def spacer(sS):
    aR = []                                             # Initialize output array (aR)
    for i in range(0, len(sS)):                         # Loop through all sequences
        temp = ""                                       # Store the updated sequence in temp first
        for j in range(0, len(sS[i])):                  # loop through the entire sequence
            if j % 10 == 0:                             # Check if it reaches base pairs at multiples of 10
                temp = temp + " "                       # Add space if the statement is true
            temp = temp + sS[i][j]                      # Add the character at current check position
        aR.append(temp)                                 # Add the temp result to output array
    return(aR)                                          # Return the final result

#Obtain the name of the fasta file from the user and open it (loop until program can find the file)
while(True):
  try:
      FASTA_file_name = input("Please input the name of the fasta file you want to work with: ")
      FASTA_file = open(f"{FASTA_file_name}.fas")
      break
  except:
      print("No such file found. Please try it again! ")

# Obtain the name of the enzyme file from the user and open it (loop until program can find the file)
while(True):
  try:
      enzyme_file_name = input("Please input the name of the file containing the enzymes: ")
      enzyme_file = open(f"{enzyme_file_name}.txt")
      break
  except:
      print("No such file found. Please try it again! ")

# Defining varibales:
iEnzymeCount = 0                                    # Variable to store how many enzymes there are in total
aEnzymeName = []                                    # Variable to store array of enzyme name
aEnzymeSequenceR = []                               # 1d array to store enzyme sequence to the right of cleavage site
aEnzymeSequenceL = []                               # 1d array to store enzyme sequence to the left of cleavage site
aEnzymeRestrictions = []                            # 2d array to store cleavage sites of all enzymes
aFragmentedSequences = []                           # 2d array to store all the fragmented sequences from enzymes
aFinalSequenceResults = []                          # 2d array to store all the fragmented sequences with space
FASTA_content = FASTA_file.readlines()              # Load lines in the fasta file
sSequenceName = FASTA_content[0]                    # Load the name of sequence from first line
sSequenceName = sSequenceName[1:len(sSequenceName)] # (Optional: remove ">" from the sequence name)
targetSequence = FASTA_content[1].strip()           # Load the sequence enzymes will be cutting

# Obtaining enzyme name, left restriction sequence and right restriction sequence from file
for line in enzyme_file:
  iEnzymeCount += 1                 # For each new line, we will have new enzyme. So +1 every new line read
  line = line.replace(";", " ")     # Replace semi-colon with space
  line = line.replace("%", " ")     # Replace percentage with space
  line = line.split()               # Split the line by space
  aEnzymeName.append(line[0])       # Store first delimited data as enzyme name
  aEnzymeSequenceR.append(line[1])  # Store second delimited data as sequence to the right
  aEnzymeSequenceL.append(line[2])  # Store third delimited data as sequence to the left

# Find restriction sites, fragment target sequence based on each restriction enzymes, and space it.
for i in range(iEnzymeCount):       # Loop through all the enzymes
  # Find cleavage location using function #1 and store it.
  aEnzymeRestrictions.append(findResrictionSite(targetSequence,aEnzymeSequenceR[i],aEnzymeSequenceL[i]))
  # With cleavage site identified, cleave the sequence into fragments and store it.
  aFragmentedSequences.append(fragmentor(targetSequence,aEnzymeRestrictions[i]))
  # With each fragmented sequence store, add space to every 10 base pairs
  aFinalSequenceResults.append(spacer(aFragmentedSequences[i]))

# Print out final output to console
print("---------------------------------------")
print("Sequence name: ", sSequenceName)
print("The sequence is", len(targetSequence), " bases long.")
for i in range(iEnzymeCount):                                   # Loop through all the enzymes
    if len(aEnzymeRestrictions[i]) == 0:                        # If no cutting site, print the result separately

        print("---------------------------------------")
        print("There are no sites for", aEnzymeName[i], ".")
        print("")

    else:                                                       # If there is cutting site, print the information

        count = 1
        print("---------------------------------------")
        print("There are ", len(aEnzymeRestrictions[i]), " cutting sites for ", aEnzymeName[i],
                          ", cutting at ", aEnzymeSequenceR[i], "^", aEnzymeSequenceL[i])
        print("There are ", len(aEnzymeRestrictions[i])+1, " fragments: ")
        print("")

        # Loop through all enzyme fragments
        for j in range(len(aEnzymeRestrictions[i])+1):

            # First print out the fragment length
            print("Length: ", len(aFragmentedSequences[i][j]))

            # Loop through k times (where k is length // 60 + 1)
            for k in range((len(aFragmentedSequences[i][j])//60)+1):

                # If we are on the last part (last part that is not 60 base pairs long
                if k == (len(aFragmentedSequences[i][j])//60):

                    # Print from previous last position to the end of the fragment
                    print(count,"\t", aFinalSequenceResults[i][j][66*k: len(aFinalSequenceResults[i][j])])
                    # Record what position we are at after this
                    count += len(aFragmentedSequences[i][j]) % 60

                else:

                    # Print out sequence in 60 base pair length
                    print(k*60+1,"\t", aFinalSequenceResults[i][j][66*k:66*(k+1)])
                    # Record what position we are at after this
                    count += 60

    print("")

# (Optional: output the results into a text file named "summary")
with open('Summary.txt', 'w') as f:
    f.write("---------------------------------------\n")
    f.write("Sequence name: " +sSequenceName +"\n")
    f.write("The sequence is" +str(len(targetSequence)) +" bases long.\n")
    for i in range(iEnzymeCount):  # Loop through all the enzymes
        if len(aEnzymeRestrictions[i]) == 0:  # If no cutting site, output the result separately

            f.write("---------------------------------------\n")
            f.write("There are no sites for" +aEnzymeName[i] +".\n")
            f.write("\n")

        else:  # If there is cutting site, output the information

            count = 1
            f.write("---------------------------------------\n")
            f.write("There are " +str(len(aEnzymeRestrictions[i])) +" cutting sites for " +str(aEnzymeName[i]) +
                  ", cutting at " +str(aEnzymeSequenceR[i]) +"^" +str(aEnzymeSequenceL[i]) +"\n")
            f.write("There are " +str(len(aEnzymeRestrictions[i]) + 1) +" fragments: \n")
            f.write("\n")

            # Loop through all enzyme fragments
            for j in range(len(aEnzymeRestrictions[i]) + 1):

                # First output out the fragment length
                f.write("Length: " +str(len(aFragmentedSequences[i][j])) +"\n")

                # Loop through k times (where k is length // 60 + 1)
                for k in range((len(aFragmentedSequences[i][j]) // 60) + 1):

                    # If we are on the last part (last part that is not 60 base pairs long
                    if k == (len(aFragmentedSequences[i][j]) // 60):

                        # Output from previous last position to the end of the fragment
                        f.write(str(count) +"\t" +str(aFinalSequenceResults[i][j][66 * k: len(aFinalSequenceResults[i][j])]) +"\n")
                        # Record what position we are at after this
                        count += len(aFragmentedSequences[i][j]) % 60

                    else:

                        # Output out sequence in 60 base pair length
                        f.write(str(k * 60 + 1) +"\t" +str(aFinalSequenceResults[i][j][66 * k:66 * (k + 1)]) +"\n")
                        # Record what position we are at after this
                        count += 60

        f.write("")
# save and close the "summary.txt" file
f.close()
