import os
import tempfile
from flask import Flask, request, jsonify
import librosa
import librosa.display
import matplotlib.pyplot as plt
import matplotlib
import socket
import json
from helper import *
from parser import *


#import jsonpickle

time = 5

app = Flask(__name__)


@app.route("/members",methods = ["GET", "POST"])
def members():
    return {"members":["Member1", "Member2", "Member3", "FFFF"]}

@app.route('/uri-example', methods = ['GET','POST'])
def temp():
    
    box1_jsonGET = None
    print(request.files)
   
    if request.method == 'POST':
        temp_dir = tempfile.mkdtemp()
        file_array = request.files
        #print(file_array)
        #wav_file.save(save_path)
        #data_frAPI = request.get_json()
        #recordings_frAPI = data_frAPI["recordings"]
        #print(recordings_frAPI)
        #time = 5
        index = 0

        N = len(file_array)
        print("file array ilk eleemnt: ", file_array['0'])
        print(N)
        uri_recbase_arr = []
        for i in range(N):
            int_str = str(i)
            file_instance = file_array[int_str]
            print("file is:,",file_instance)
            new_file_name = "temp" + int_str + ".wav"
            save_path = os.path.join(temp_dir, new_file_name)
            print("file_instance is: ", file_instance)
            file_instance.save(save_path)
            print("save_path", save_path)
            #uri_recbase = rec_base["file"][7:].replace("%25", "%",2)
            uri_recbase_arr.append(save_path)


        #####
        newBoxes = initialize(uri_recbase_arr, index, time)

        M = len(newBoxes[index].sim_arr)
        for j in range(M):
            list = sorted(newBoxes[index].sim_arr[j], key=operator.itemgetter(1, 1))
            newBoxes[index].sim_arr [j] = list


        print("\n REC-API############################")
        #reocrdingler boxlar newBox[index] hangi indexteki recordingdeki 
        print(newBoxes[index].sim_arr)
        for line in newBoxes[index].sim_arr:
            print("----")
            print(line)
        #similarity arrray bu, buna göre grup + sequence
        res = newBoxes[index].sim_arr

        return jsonify({'data': res})
    else:
        return {'data': box1_jsonGET}


@app.route('/index-example', methods = ['GET','POST'])
def temp2():
    if request.method == 'POST':
        temp_dir = tempfile.mkdtemp()
        file_array = request.files
        forms_frAPI = request.form
        
        print(  "jeson?", file_array)
        
        # datajson = request.get_json()
        # print("json ile gelitoemu ", datajson)
        #formObj = forms_frAPI["editToAPI"].json()
      
        print("formdan gelen: ",forms_frAPI)
        print("forms_frAPI[]",forms_frAPI["editToAPI"])
        array = json.loads(forms_frAPI["editToAPI"])
        print("array json im ile", array)
        indexes = array
        print("ilk index", array[0])

       
        #indexes = formObj["editArray"] ## (1,2) = recording1 box2
    
        N = len(file_array)
        
        uri_recbase_arr = []
        for i in range(N):
            int_str = str(i)
            file_instance = file_array[int_str]
            print("file is:,",file_instance)
            new_file_name = "temp2" + int_str + ".wav"
            save_path = os.path.join(temp_dir, new_file_name)
            print("file_instance is: ", file_instance)
            file_instance.save(save_path)
            print("save_path", save_path)
            #uri_recbase = rec_base["file"][7:].replace("%25", "%",2)
            uri_recbase_arr.append(save_path)


        #recordings_frAPI = data_frAPI["recordings"]
        index = 0

        # N = len(recordings_frAPI)
        # uri_recbase_arr = []
    
        # for i in range(N):
        #     rec_base = recordings_frAPI[i]
        #     uri_recbase = rec_base["file"][7:].replace("%25", "%",2)
        #     uri_recbase_arr.append(uri_recbase)
        print("\n EDIT-API############################")
        print("the indexes are: ", indexes)
        #print(uri_recbase_arr[0])


        # someAddress = uri_recbase_arr[0]
        # lenAdd = len(someAddress)
        # indexDot = someAddress.index('.')
        # lastSubString = lenAdd - indexDot
        # newAddress = someAddress[:indexDot] + "999" + ".caf"# +someAddress[-lastSubString:]
        
        
        #print(newAddress)
        #fin_rec = giveAFile (indexes, uri_recbase_arr, newAddress)  

        
        #sound = AudioSegment.from_file(uri_recbase_arr[0])
        #sound.export(newAddress , format = "caf")
        #wav_file = AudioSegment.from_file(file = uri_recbase_arr[0])
        #wav_file.export(newAddress, format = "caf" )
            #      new_file_name = "temp2" + int_str + ".wav"
            # save_path = os.path.join(temp_dir, new_file_name)
            # print("file_instance is: ", file_instance)
            # file_instance.save(save_path)
        newAddress = "editedSongAddress12.caf"
        save_path = os.path.join(temp_dir,newAddress)
        sound_new = changeParts(indexes, uri_recbase_arr, index, time*1000)
        sound_new.export(save_path , format = "caf")
        

        edited_recording = "file://" + save_path
        # edited_recording = edited_recording.replace("%", "%25",2)

        #edited_recording = "IF YeniData"
        return jsonify({'data': edited_recording})
    else:
        return {'data': "ELSE YeniData"}

@app.route('/auto-example', methods = ['GET','POST'])
def temp3():
    if request.method == 'POST':
        temp_dir = tempfile.mkdtemp()
        file_array = request.files
        forms_frAPI = request.form
        
        indexes_input = json.loads(forms_frAPI["editToAPI"])

        #indexes = formObj["editArray"] ## (1,2) = recording1 box2
    
        N = len(file_array)
        
        uri_recbase_arr = []
        for i in range(N):
            int_str = str(i)
            file_instance = file_array[int_str]
            print("file is:,",file_instance)
            new_file_name = "temp2" + int_str + ".wav"
            save_path = os.path.join(temp_dir, new_file_name)
            print("file_instance is: ", file_instance)
            file_instance.save(save_path)
            print("save_path", save_path)
            #uri_recbase = rec_base["file"][7:].replace("%25", "%",2)
            uri_recbase_arr.append(save_path)

        #####
        newBoxes = initialize(uri_recbase_arr, index, time)

        M = len(newBoxes[index].sim_arr)
        for j in range(M):
            list = sorted(newBoxes[index].sim_arr[j], key=operator.itemgetter(1, 1))
            newBoxes[index].sim_arr [j] = list


        print("\n REC-API############################")
        #reocrdingler boxlar newBox[index] hangi indexteki recordingdeki 
        print(newBoxes[index].sim_arr)
       
        #similarity arrray bu, buna göre grup + sequence
        res = newBoxes[index].sim_arr
        indexes = []
        print("the actual res: ", res)
        i = 0
        for line in res:
            temp_array=[line[0][0][0],line[0][0][1]]
            current_index = [index,i]
            to_be_swapped = [current_index,temp_array ]
            indexes.append(to_be_swapped)
            i += 1
        print(indexes)

        index = 0

        print("\n EDIT-API############################")
        print("the indexes are: ", indexes)
        print(uri_recbase_arr[0])

        #print(newAddress)
        #fin_rec = giveAFile (indexes, uri_recbase_arr, newAddress)  

        
        #sound = AudioSegment.from_file(uri_recbase_arr[0])
        #sound.export(newAddress , format = "caf")
        #wav_file = AudioSegment.from_file(file = uri_recbase_arr[0])
        #wav_file.export(newAddress, format = "caf" )

        sound_new = changeParts(indexes, uri_recbase_arr, index, time*1000)
        newAddress = "autoEditedSongAddress.caf"
        save_path = os.path.join(temp_dir,newAddress)
        sound_new.export(save_path , format = "caf")
        

        edited_recording = "file://" + save_path
        return jsonify({'data': edited_recording})
    else:
        return {'data': "ELSE YeniData"}


if __name__ == "__main__":
    app.run(host="172.20.151.17", port="5000", debug=True)
    #app.run( port="5000", debug=True)