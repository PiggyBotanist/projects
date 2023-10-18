#!/bin/bash

# Introduction:
# This shell script was written to automate quality trimming, filtering and merging of forward(R1) and reverse(R2) reads
# of fecal 16S V3-V4 region microbiome samples obtained from illumina MiSeq sequencer. Packages used include trimmomatic
# (https://github.com/usadellab/Trimmomatic), fastqc (https://github.com/s-andrews/FastQC), and PEAR 
# (https://github.com/tseemann/PEAR).    

# Usage: sbatch/srun 16S_preanalysis_processing.sh <illumina_raw_reads_directory>

# Input: the "illumina_raw_reads_directory can be absolute or relative path, and within the folder there should be subfolders,
# where each subfolders contains two files containing forward(R1) and reverse(R2) read.

# Output (a total of 4 directories will be generated after running the script):
# - fastqc_dir: a directory showing a summary of the quality of sequences
# - trimmed_dir: directory containg all trimmed reads
# - merged_dir: directory containg trimmed and merged(forward+reverse) reads
# - result_dir: merged result in .fasta format (most common format for downstream analysis)

# Load necessary modules
module load StdEnv/2020  gcc/9.3.0
module load fastqc/0.11.9
module load trimmomatic/0.39
module load pear/0.9.11

# Locate where the raw illumina files are located:
raw_read_dir=$1

# Define output location:
fastqc_dir="fastqc_results"
trimmed_dir="adaptor_trimmed_reads"
merge_dir="trimmedAndMerged_result"
result_dir="merged_fasta_result"

# Makie directories to store results
mkdir $fastqc_dir $trimmed_dir $merge_dir $result_dir

# Step 1. Perform adaptor_trimming
# Loop through all samples in the raw read directory
for directory in ${raw_read_dir}/*;do
    # Obtain the name of the subdirectory/sample name
    directory_name="$(basename $directory)"

    # Obtain the path to forward and reverse reads
    forward_read=$(find $directory/ -name *_R1_001.fastq.gz)
    reverse_read=$(find $directory/ -name *_R2_001.fastq.gz)

    # Obtain name of forward and reverse reads
    filename=$(basename $forward_read _R1_001.fastq.gz)

    # Make necessary directories to store the trimmed results
    mkdir $trimmed_dir/$directory_name
    output_dir="$trimmed_dir/$directory_name"

    # Trim adaptors and store adaptor trimmed file into the result directory
    echo "trimming $filename ..."
    java -jar $EBROOTTRIMMOMATIC/trimmomatic-0.39.jar PE -phred33 \
    $forward_read $reverse_read \
    $output_dir/${filename}_R1_paired.fastq.gz $output_dir/${filename}_R1_unpaired.fastq.gz \
    $output_dir/${filename}_R2_paired.fastq.gz $output_dir/${filename}_R2_unpaired.fastq.gz \
    ILLUMINACLIP:$EBROOTTRIMMOMATIC/adapters/TruSeq3-PE.fa:2:30:10 LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36

    # Make necessary directories to store fastqc results
    mkdir -p $fastqc_dir/$direcotry_name/${filename}_R1_001_raw
    mkdir -p $fastqc_dir/$direcotry_name/${filename}_R2_001_raw
    mkdir -p $fastqc_dir/$direcotry_name/${filename}_R1_001_PE_trimmed
    mkdir -p $fastqc_dir/$direcotry_name/${filename}_R2_001_PE_trimmed

    # Perform fastqc on the trimmed file
    fastqc $forward_read -o $fastqc_dir/$direcotry_name/${filename}_R1_001_raw --nogroup
    fastqc $reverse_read -o $fastqc_dir/$direcotry_name/${filename}_R2_001_raw --nogroup
    fastqc $output_dir/${filename}_R1_paired.fastq.gz -o $fastqc_dir/$direcotry_name/${filename}_R1_001_PE_trimmed --nogroup
    fastqc $output_dir/${filename}_R2_paired.fastq.gz -o $fastqc_dir/$direcotry_name/${filename}_R2_001_PE_trimmed --nogroup

    # merge forward and reverse strands
    mkdir $merge_dir/$directory_name

    # might need to adjust -v, -p.
    # -v: specifies the minimum overlap length (in base pairs) required for the reads to be merged. 
    # -p: specifies the probability of observing a random sequence match between the forward and reverse reads.
    pear -f $output_dir/${filename}_R1_paired.fastq.gz -r $output_dir/${filename}_R2_paired.fastq.gz -o $merge_dir/$directory_name/$filename
    seqtk seq -a $merge_dir/$directory_name/${filename}.assembled.fastq > $result_dir/$filename

    echo "finished processing $filename"
done

