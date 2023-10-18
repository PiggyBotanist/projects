#!/bin/bash

# Introduction:
# Using the result from "rawDataQualityControl.sh/result_dir" folder, the 16S were analyzed using mothur using 
# the follow shell script.

# Note: few bugs have been detected in mothur version 1.48.0 as of July 2023. Hence, both 1.46.0 and 1.48.0 were used
# for some commands.

# Set path to Mothur executable
mothur_48="/path_to_mothur-1.48.0.exe"
mothur_46="/path_to_mothur-1.46.0.exe"

# Set path to Silva reference alignment
align_ref="/path_to_alignmentDatabase(nr_v132.align)"
bact_ref="/path_to_16SDatabase(e.g: silva_v4.fa)"
tax_ref="/path_to_taxonomyDatabase(e.g: nr_v132.tax)"

# Set path to directory containing FASTA files to process
input_dir="/path_to_files_from_result_dir"
log_dir="/path_to_folder_where_you_want_to_store_your_log_files"

# Set the input and output directories in Mothur
#$mothur "#set.dir(input=${input_dir}, output=${output_dir})"

# Problems with running one mothur execution for all commands, figure it is only possible if I run all commands together
# Set up initial commands

# Set up database for v4 region only
#command="$command pcr.seqs(fasta=${bact_ref}.fasta, start=11895, end=25318, keepdots=F);"
#command="$command rename.file(input=${bact_ref}.pcr.fasta, new=silva_v4.fasta);"

# Loop through each file in the input directory and process them
for file in ${input_dir}/*_L001.fa; do
    # Get the basename of the file
    basename=$(basename "$file" .fa)
    file_path="${input_dir}\\${basename}"
    #echo "$file"

    # Commands were split into 4 steps (filtering, clustering, classifing, and rarefy + otu)
    # All commands were parsed into a long string first, and ran at once in mothur (to prevent mothur from opening and
    # writing a log everytime a command was called.
    
    # Optional: alocate processors to decrease run time
    command_step1="#set.current(processors=6);"
    command_step2="#set.current(processors=6);"
    command_step3="#set.current(processors=6);"
    command_step4="#set.current(processors=6);"

    # Step 1: Done in mothur v1.48.0
    command_step1="$command_step1 unique.seqs(fasta=${file_path}.fa);"
    command_step1="$command_step1 align.seqs(fasta=${file_path}.unique.fa, template=${bact_ref});"
    command_step1="$command_step1 summary.seqs(fasta=${file_path}.unique.align);"
    command_step1="$command_step1 screen.seqs(fasta=${file_path}.unique.align, count=${file_path}.count_table, start=1, end=13424);"
    command_step1="$command_step1 summary.seqs(fasta=${file_path}.unique.good.align);"
    command_step1="$command_step1 filter.seqs(fasta=${file_path}.unique.good.align, vertical=T, trump=.);"
    command_step1="$command_step1 unique.seqs(fasta=${file_path}.unique.good.filter.fasta, count=${file_path}.good.count_table);"

    # Done using mothur v1.46.0
    command_step2="$command_step2 pre.cluster(fasta=${file_path}.unique.good.filter.unique.fasta, count=${file_path}.unique.good.filter.count_table, diffs=2);"

    # Done using mothur v1.48.0
    command_step3="$command_step3 chimera.vsearch(fasta=${file_path}.unique.good.filter.unique.precluster.fasta, count=${file_path}.unique.good.filter.unique.precluster.count_table, dereplicate=t);"
    command_step3="$command_step3 classify.seqs(fasta=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.fasta, count=${file_path}.unique.good.filter.unique.precluster.count_table, reference=${RDP_fasta}, taxonomy=${RDP_tax}, cutoff=90);"
    command_step3="$command_step3 remove.lineage(fasta=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.fasta, count=${file_path}.unique.good.filter.unique.precluster.count_table, taxonomy=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.pds.wang.taxonomy, taxon=Chloroplast-Mitochondria-unknown-Archaea-Eukaryota);"
    command_step3="$command_step3 summary.tax(taxonomy=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.pds.wang.pick.taxonomy, count=${file_path}.unique.good.filter.unique.precluster.pick.count_table);"

    # OTU Claffification:
    command_step4="$command_step4 dist.seqs(fasta=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.fasta, cutoff=0.03);"
    command_step4="$command_step4 cluster(column=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.dist, count=${file_path}.unique.good.filter.unique.precluster.count_table, cutoff=0.03);"
    command_step4="$command_step4 cluster.split(fasta=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.fasta, count=${file_path}.unique.good.filter.unique.precluster.count_table, taxonomy=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.pds.wang.pick.taxonomy, taxlevel=4, cutoff=0.03);"
    command_step4="$command_step4 make.shared(list=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.list, count=${file_path}.unique.good.filter.unique.precluster.count_table, label=0.03);"
    command_step4="$command_step4 classify.otu(list=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.list, count=${file_path}.unique.good.filter.unique.precluster.pick.count_table, taxonomy=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.pds.wang.pick.taxonomy, label=0.03);"
    command_step3="$command_step3 rarefaction.single(shared=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.shared);"

    # Alpha Diversity Calculation:
    command_step5 ="$command rarefaction.single(shared=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.shared, calc=sobs, freq=100);"

    # Beta Diversity Calculation:
    command_step5 ="$command dist.shared(shared=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.shared, calc=braycurtis-jclass, subsample=t);"
    command_step5 ="$command pcoa(phylip=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.braycurtis.0.03.lt.ave.dist);"
    command_step5 ="$command nmds(phylip=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.braycurtis.0.03.lt.ave.dist);"
    command_step5 ="$command amova(phylip=${file_path}.unique.good.filter.unique.precluster.denovo.vsearch.opti_mcc.braycurtis.0.03.lt.ave.dist, design=mouse.time.design);"
    
    $mothur_48 "$command_step1" > ${log_dir}/${basename}_step1.txt
    $mothur_46 "$command_step2" > ${log_dir}/${basename}_step2.txt
    $mothur_48 "$command_step3" > ${log_dir}/${basename}_step3.txt
    $mothur_48 "$command_step4" > ${log_dir}/${basename}_OTU.txt
    $mothur_48 "$command_step4" > ${log_dir}/${basename}_diversity.txt   
done
