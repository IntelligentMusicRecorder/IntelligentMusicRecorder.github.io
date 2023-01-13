from pydub import AudioSegment

def changeParts(indexArray, uriArray, index, time):
    #for kullanılacak ve index for dışında kullanılacak
    base_sound = AudioSegment.from_file(uriArray[index])
    comp_sound = AudioSegment.from_file(uriArray[1])
    
    edited_Base = base_sound
    N = len(indexArray)
    for i in range(N):
        base_part = indexArray[i][0]
        compared_part = indexArray[i][1]
        edited_Base = changeParts_helper(edited_Base, comp_sound, base_part, compared_part, time)
        
    return edited_Base

def changeParts_helper(base, comp, baseInfo, compInfo, time):
    trim_Start = baseInfo[1] * time
    trim_End = trim_Start + time

    part_Start = compInfo[1] * time
    part_End = part_Start + time
    
    base_sound_pre = base[0:trim_Start]
    base_sound_aft = base[trim_End:len(base)]
    part_ready = comp[part_Start:part_End]
    
    edit= base_sound_pre + part_ready + base_sound_aft
    
    return edit



#############################################################################################
##############################   assign similarities   ######################################

#AudioSegment.ffmpeg = "C:/Users/lenovo/anaconda3/Lib/site-packages/ffmpeg"

time = 5000

#startTime and endTime should be in milliseconds
def cutAPart(audioFileUri, startIndex):
    sound = AudioSegment.from_file(audioFileUri)
    startTime = startIndex * time
    endTime = 0
    if (startTime + time) <= len(sound)-1:
        endTime = startTime + time
    else:
        endTime = len(sound)-1
    return sound[startTime:endTime]

def untilTheEnd(audioFileUri, startIndex):
    sound = AudioSegment.from_file(audioFileUri)
    startTime = startIndex * time + time
    array = []
    if startTime <= len(sound)-1 :
        array = sound[startTime:]
    return array
  
def fromTheBeginning(audioFileUri, endIndex):
     endTime = endIndex * time
     sound = AudioSegment.from_file(audioFileUri)
     return sound[:endTime]
 
def fromAPoint(array, previousIndex, thisIndex):
    startTime = previousIndex * time + time
    thisTime = thisIndex*time
    return array[startTime:thisTime]

def exportCuttedPart(Array,folderName, route):
    Array.export(route+folderName+".caf", format = "caf")


def combineTwoParts(Array1, Array2):
    return Array1+Array2

def exportTheArray(finalArray, AudioFileUri):
    finalArray.export(AudioFileUri, format = "wav")
    
    
def giveAFile(indexArray, uriArray, newPath):
   

    finalArray = []
    cuttedArray = cutAPart(uriArray[indexArray[0][1][0]],indexArray[0][1][1])
    if indexArray[0][0][1] == 0:
        untilEnd = untilTheEnd(uriArray[indexArray[0][0][0]],0)
        finalArray = cuttedArray + untilEnd
        
    else:
            
        untilEnd = untilTheEnd(uriArray[indexArray[0][0][0]],indexArray[0][0][1])
        fromStart = fromTheBeginning(uriArray[indexArray[0][0][0]], indexArray[0][0][1])
        finalArray = fromStart + cuttedArray + untilEnd
    
    previousIndex = indexArray[0][1][1]    
    
    for x in indexArray[1:]:
        cuttedArray = cutAPart(uriArray[x[1][0]],x[1][1])
        untilEnd = untilTheEnd(uriArray[x[0][0]],x[0][1])
        finalArray = fromAPoint(finalArray, previousIndex, x[0][1]) + cuttedArray + untilEnd
        previousIndex = x[1][1]
        
        
    exportTheArray(finalArray, newPath)