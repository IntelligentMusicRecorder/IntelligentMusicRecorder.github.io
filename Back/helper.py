from flask import Flask, request, jsonify
import numpy as np
import scipy.spatial.distance as dist
import librosa
import librosa.display
from matplotlib.patches import ConnectionPatch
import matplotlib.pyplot as plt
import matplotlib
import socket

import operator # can change


from scipy.io import wavfile

class box:
    def __init__(self, arr_rec, ID):
        indsAndSim = 2 #storing indexes of packet eg. Box2_Packet3 = (2,3) and similarity measure for that packet
        num_similar = 5 #number of similarity measure for the packets; 5 max similarity packet is stored
        self.box_ID = ID
        self.len_rec_arr = len(arr_rec)
        self.rec_arr = arr_rec
        self.group_arr = [None for _ in range(self.len_rec_arr)]
        self.sim_arr = [[] for _ in range(self.len_rec_arr)]

#############################################################################################
##############################   initialize   ######################################
def initialize(recs, index, time): #run the code 
    
    N = len(recs)
    parsedBox_rec_arr = []
    
    
    for i in range(N):
        parsed_Rec = parse_recs(recs[i], time)
        parsedBox_rec_arr.append(box(parsed_Rec,i))

    
    for i in range(N):
        if (i != index):
            assign_similarities(parsedBox_rec_arr[index],parsedBox_rec_arr[i], time)

    return parsedBox_rec_arr
              
#############################################################################################
##############################   assign similarities   ######################################

#diğer recordingler için base_box değişçek 
def assign_similarities(base_box, compared_box, time): #base_box, compared_box:arrays of parsed parts 
    
    N = base_box.len_rec_arr
    M = compared_box.len_rec_arr
    
    """
    groupNo = 0
    for k in range(N):
        base_box.group_arr[k] = groupNo
        groupNo += 1
    """
    for j in range(M):
        for i in range(N):
            p,c,d,a,n = find_cost(base_box.rec_arr[i], compared_box.rec_arr[j])
            avg_a = a/time
            
            #print('groupNo:{}, i:{},j:{}, a: {}, a/time: {}'.format(groupNo,i,j,a,a/time))

            if(avg_a <= 7):
                compared_box.sim_arr[j].append([(base_box.box_ID, i),avg_a])
                base_box.sim_arr[i].append([(compared_box.box_ID, j),avg_a])

        
#############################################################################################
##############################   parse_recs  ######################################
def parse_recs(rec, packet_time): #base_rec
    
    y, sr = librosa.load(rec)
    duration = y.shape[0]/sr
    """
    #chroma_cqt
    rec_chromagram_cqt = librosa.feature.chroma_cqt(y=y, sr=sr)
    length_chrom = len(rec_chromagram_cqt)
    """
    """
    #chroma_cqt_harm
    y_harm = librosa.effects.harmonic(y=y, margin=8)
    rec_chromagram_cqt = librosa.feature.chroma_cqt(y=y_harm, sr=sr)
    length_chrom = len(rec_chromagram_cqt)
    """
    """
    #chroma_cens_harm
    y_harm = librosa.effects.harmonic(y=y, margin=8)
    rec_chromagram_cqt = librosa.feature.chroma_cens(y=y_harm, sr=sr)
    length_chrom = len(rec_chromagram_cqt)
    """
    #chroma_cqt_harm
    y_harm = librosa.effects.harmonic(y=y, margin=8)
    rec_chromagram_cqt = librosa.feature.chroma_cqt(y=y_harm, sr=sr)
    length_chrom = len(rec_chromagram_cqt)
    

    packet_count = duration // packet_time;
    packet_count = int(packet_count)
    remainding = duration%packet_time;
    box_chrom = [None]*(packet_count+1)
    
    ####begining time####
    #idx2 = tuple([slice(None), slice(*list(librosa.time_to_frames([1.3, 13])))])
    #rec_chromagram_cqt = rec_chromagram_cqt[idx2]
    
    for i in range(packet_count):
        idx = tuple([slice(None), slice(*list(librosa.time_to_frames([i*packet_time, (i+1)*packet_time])))])
        packet_chrom = rec_chromagram_cqt[idx]
        box_chrom[i] = packet_chrom
            
    idx = tuple([slice(None), slice(*list(librosa.time_to_frames([(i+1)*packet_time,((i+1)*packet_time + remainding) ])))])
    packet_chrom = rec_chromagram_cqt[idx]
    box_chrom[i+1] = packet_chrom


    return (box_chrom)
#############################################################################################
##############################   find_cost  ######################################
def find_cost(base_chrom, compared_chrom): #base_rec, compared_rec:path 
    
    x_seq = base_chrom.T
    y_seq = compared_chrom.T
    
    
    #Y = cdist(XA, XB, 'sqeuclidean')

    dist_mat = dist.cdist(x_seq, y_seq, "cosine")
    dist_mat = np.square(dist_mat)
    path, cost_mat = dp(dist_mat)
    
    alignment_cost = cost_mat[-1, -1]
    normalized_alignment_cost = cost_mat[-1, -1]/(y_seq.shape[0] + x_seq.shape[0])


    return (path, cost_mat, dist_mat, alignment_cost, normalized_alignment_cost)

#############################################################################################
##############################   DTW   ######################################
def dp(dist_mat):
    N, M = dist_mat.shape
    
    cost_mat = np.zeros((N + 1, M + 1))
    for i in range(1, N + 1):
        cost_mat[i, 0] = np.inf
    for i in range(1, M + 1):
        cost_mat[0, i] = np.inf

    traceback_mat = np.zeros((N, M))
    for i in range(N):
        for j in range(M):
            penalty = [
                cost_mat[i, j],      
                cost_mat[i, j + 1],  
                cost_mat[i + 1, j]]  
            i_penalty = np.argmin(penalty)
            cost_mat[i + 1, j + 1] = dist_mat[i, j] + penalty[i_penalty]
            traceback_mat[i, j] = i_penalty

    i = N - 1
    j = M - 1
    path = [(i, j)]
    while i > 0 or j > 0:
        tb_type = traceback_mat[i, j]
        if tb_type == 0:
            i = i - 1
            j = j - 1
        elif tb_type == 1:
            i = i - 1
        elif tb_type == 2:
            j = j - 1
        path.append((i, j))

    cost_mat = cost_mat[1:, 1:]
    return (path[::-1], cost_mat)