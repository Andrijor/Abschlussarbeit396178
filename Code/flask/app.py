from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline
#from transformers import AutoTokenizer, TFAutoModelForQuestionAnswering
#import tensorflow as tf
import numpy as np
#import pandas as pd
import json
#import timeit

app = Flask(__name__)

app.config.from_object(__name__)

CORS(app, resources={r"/*":{'origins':['http://127.0.0.1:5173', 'http://localhost:5173', 'http://192.168.122.12:5173', 'http://192.168.122.11:5173'], 'allow_headers':'Access-Control-Allow-Origin'}})

# test route
@app.route('/', methods=['GET'])
def greetings():
    return("Hello world")

@app.route('/startChapter', methods=['GET'])
def startChapter():
    if request.method == 'GET':
        messages = ''
        chapter_id = int(request.args.get('chapter_id'))

        with open("./db.json") as f:
            content_data = json.load(f)
            
            for chapter in content_data['chapters']:
                if chapter['chapter_id'] == chapter_id:
                    messages = chapter['contents']['messages']

    return messages

@app.route('/askQuestion', methods=['GET'])
def askQuestion():
    if request.method == 'GET':


        #start = timeit.default_timer()

        #Your statements here

        
        question = request.args.get('question')
        chapter_id = int(request.args.get('chapter_id'))

        if question == "":
            return("Please ask a question :)")

        model_name = "../../Models/roberta-base-squad2"
        #model_name = "../../Models/tinyroberta-squad2"
        
        #model = TFAutoModelForQuestionAnswering.from_pretrained(model_name)
        #tokenizer = AutoTokenizer.from_pretrained(model_name)
        #nlp = pipeline('question-answering', model=model, tokenizer=tokenizer)

        context = ""
        context_keywords = []
        unlocked_keywords = []
        context_images = []
        unlocked_images = []
        hasContextImages = True
        hasContextKeywords = True

        with open("./db.json") as f:
            content_data = json.load(f)
            
            for chapter in content_data['chapters']:
                if chapter['chapter_id'] == chapter_id:
                    #print('Found current chapter')
                    kw = []
                    img = []
                    #print('Initialize arrays')
                    try:
                        kw = chapter['contents']['context_keywords']
                    except KeyError:
                        hasContextImages = False
                    #except Exception as e:
                    #    raise(e)
                    #print('try to see if there are context keywords')
                    try:
                        img = chapter['contents']['context_images']
                    except KeyError:
                        hasContextImages = False
                    #except Exception as e:
                    #    raise(e)
                    #print('try to see if there are context images')
                    #if it's not there, it raises a KeyError
                    context = chapter['contents']['context']
                    #print('Save context')
                    if hasContextImages:
                        context_images = context_images + img
                    #print('Concat img list to save it')
                    if hasContextKeywords:
                        context_keywords = context_keywords + kw
                    #print('Concat kw list to save it')
                    #print(hasContextKeywords, hasContextImages)
                    break
        #print('Query Roberta')             
        nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)
        
        QA_input = {
            'question': question,
            'context': context
        }
        
        res = nlp(QA_input)
        #print('Roberta query done')
        #print(res)
        #print(res)
        #print('Prepare keywords')
        #print(len(context_keywords))
        for keyword in context_keywords:
            if res['start'] <= keyword['placement'] and res['end'] >= keyword['placement']:
                unlocked_keywords.append(keyword['keyword'])
        #print('Prepare images')
        #print(len(context_images))
        for image in context_images:
            if res['start'] <= image['placement'] and res['end'] >= image['placement']:
                unlocked_images.append(image['id'])
        #print('Finished processing unlocks')
        #stop = timeit.default_timer()

        #print('Time: ', stop - start)
        if np.less_equal(res['score'], 0.001):
            return("I don't think I can answer that with confidence.")
        else:
            #print('Started putting together the response dict')
            
            response = {'answer':str(res['answer']), 'keywords': unlocked_keywords, 'images': unlocked_images}
            #print(res)
            #print(response)
            #print('Finished putting together the response dict')
            return(response)

    return "There was an error processing your question."

if __name__ == "__main__":
    app.run(debug=True)