import re

run = true
pattern = re.compile('[^ATCG]')
DNA = "!"

print("Welcome to DNA-protein Translator!")

while(run):
  while(pattern.search(DNA)):
    DNA = str.upper(input("Please enter the DNA sequence you want to translate to protein: "))
    if(pattern.search(DNA)):
      print("sorry, you have enter an invalid string, please enter again!")
  start = find_start(DNA)
  print("We found the starting position to be: ", start)
  aminoAcid = translate(DNA[start:len(DNA)].upper(), DNA_Codons)
  print("Based on your input, we found out the amino acid sequence would be: ", aminoAcid)

# DNA codon reference:
DNA_Codons = {
    # 'M' - START, '_' - STOP
    "GCT": "A", "GCC": "A", "GCA": "A", "GCG": "A",
    "TGT": "C", "TGC": "C",
    "GAT": "D", "GAC": "D",
    "GAA": "E", "GAG": "E",
    "TTT": "F", "TTC": "F",
    "GGT": "G", "GGC": "G", "GGA": "G", "GGG": "G",
    "CAT": "H", "CAC": "H",
    "ATA": "I", "ATT": "I", "ATC": "I",
    "AAA": "K", "AAG": "K",
    "TTA": "L", "TTG": "L", "CTT": "L", "CTC": "L", "CTA": "L", "CTG": "L",
    "ATG": "M",
    "AAT": "N", "AAC": "N",
    "CCT": "P", "CCC": "P", "CCA": "P", "CCG": "P",
    "CAA": "Q", "CAG": "Q",
    "CGT": "R", "CGC": "R", "CGA": "R", "CGG": "R", "AGA": "R", "AGG": "R",
    "TCT": "S", "TCC": "S", "TCA": "S", "TCG": "S", "AGT": "S", "AGC": "S",
    "ACT": "T", "ACC": "T", "ACA": "T", "ACG": "T",
    "GTT": "V", "GTC": "V", "GTA": "V", "GTG": "V",
    "TGG": "W",
    "TAT": "Y", "TAC": "Y",
    "TAA": "_", "TAG": "_", "TGA": "_"
}

# Find start location
def find_start(seq):
    for i in range(len(seq)):
        if seq[i:i+3].upper() == "ATG":
            return i

# Find the sequence
def translate(seq, DNA_Codons):
    answer = ""
    Sequence = seq
    for i in range(len(seq)//3):
        currentCodon = Sequence[0:3]
        print(currentCodon)
        if currentCodon == "TAA" or currentCodon == "TAG" or currentCodon == "TGA":
            break
        answer += DNA_Codons.get(currentCodon)
        Sequence = Sequence[3:len(Sequence)]
    return answer
