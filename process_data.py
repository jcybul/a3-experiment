import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from os import makedirs
import csv

def filter_uncompleted(data):
    users = data[data['questionNumber'] == 62]['userId'].unique()
    return data[data['userId'].isin(users)]    

def err(data):
    n = data.shape[0]
    return (sum(data['error']) / n, 1.96 * np.std(data['error']) / np.sqrt(n))

def process():
    # read csv file
    data = pd.read_csv("data.csv")

    # Filter out users that did not complete the entire survey
    data = filter_uncompleted(data)

    data['error'] = np.log(np.abs(data['correctAnswer'] - data['answer']) + 1/8) / np.log(2)


    # for (user, graph), group in data.groupby(['userId', 'graphType']):
    #     error = sum(group['error']) / group.shape[0]
    #     print("On average user", user, "had an error of", error, "for the", graph, "graph")


    user1 = data[data['userId'] % 2 == 1] #reported nothing
    user2 = data[data['userId'] % 2 == 0] #reported correct answer

    user1["type"] =   user1["graphType"] +" Feedback"
    user2["type"] =  user2["graphType"] +" No Feedback"
    print(user1)
    headerList = ['type', 'error']
    f = open('error.csv', 'w')
    user1.to_csv("error.csv",header=True)
    user2.to_csv("error.csv",mode='a' ,header=False)


    return


    # create the csv writer
   # writer = csv.writer(f)
   # writer.writerow(headerList)

    # write a row to the csv file



    print("Bar graph error for no reporting: ", err(user1[user1['graphType'] == "bar"]))
    #writer.writerow(["bar no feedback ",err(user1[user1['graphType'] == "bar"])[0],err(user1[user1['graphType'] == "bar"])[1]])
    print("Area graph error for no reporting: ", err(user1[user1['graphType'] == "area"]))
   # writer.writerow(["area no feedback ",err(user1[user1['graphType'] == "area"])[0],err(user1[user1['graphType'] == "area"])[1]])
    print("Bubble graph error for no reporting: ", err(user1[user1['graphType'] == "bubble"]))
   # writer.writerow(["bubble no feedback ",err(user1[user1['graphType'] == "bubble"])[0],err(user1[user1['graphType'] == "bubble"])[1]])
    print("Bar graph error with reporting: ", err(user2[user2['graphType'] == "bar"]))
   # writer.writerow(["bar feedback ",err(user2[user2['graphType'] == "bar"])[0],err(user2[user2['graphType'] == "bar"])[1]])
    print("Area graph error with reporting: ", err(user2[user2['graphType'] == "area"]))
   # writer.writerow(["area feedback ",err(user2[user2['graphType'] == "area"])[0],err(user2[user2['graphType'] == "area"])[1]])
    print("Bubble graph error with reporting: ", err(user2[user2['graphType'] == "bubble"]))
    #writer.writerow(["bubble feedback ",err(user2[user2['graphType'] == "bubble"])[0],err(user2[user2['graphType'] == "bubble"])[1]])
    # Bar graph error for no reporting:  1.126405463555971
    # Area graph error for no reporting:  3.7655761530714513
    # Bubble graph error for no reporting:  2.475787069045061
    # Bar graph error with reporting:  1.6054321229135429
    # Area graph error with reporting:  3.195102334026163
    # Bubble graph error with reporting:  2.7329638540851517


    # open the file in the write mode

    # close the file
    f.close()
    # fig, axes = plt.subplot((3, 1))
    makedirs("img/plots", exist_ok=True)
    for idx, group in enumerate([user1, user2]):
        for name, group_data in group.groupby("graphType"):
            fig = plt.figure()
            pd.plotting.bootstrap_plot(group_data["error"], fig=fig)
            fig.savefig("img/plots/group1{}_{}.png".format(idx, name))

    return

    bars = user1[user1['graphType'] == 'bar']
    totalbars1 = bars.shape[0]
    print("The total answers for bars and user 1 is:  ", totalbars1)

    CorrectAnswers = bars[bars["correctAnswer"] == bars["answer"]]
    correctbars1 = CorrectAnswers.shape[0]
    print("The total correct answers for bars and user 1 is:  ", correctbars1)
    print("Percentage of correct answers: ", correctbars1/totalbars1)

    bars2 = user2[user2['graphType'] == 'bar']
    totalbars2 = bars2.shape[0]
    print("The total answers for bars and user 2 is:  ", totalbars2)

    CorrectAnswers = bars2[bars2["correctAnswer"] == bars2["answer"]]
    correctbars2 = CorrectAnswers.shape[0]
    print("The total correct answers for bars and user 2 is:  ", correctbars2)
    print("Percentage of correct answers: ", correctbars2 / totalbars2)


    bubble = user1[user1['graphType'] == 'bubble']
    totalbubble1 = bubble.shape[0]
    print("The total answers for bubble and user 1 is:  ", totalbubble1)

    CorrectAnswers = bubble[bubble["correctAnswer"] == bubble["answer"]]
    correctbubble1 = CorrectAnswers.shape[0]
    print("The total correct answers for bubble and user 1 is:  ", correctbubble1)
    print("Percentage of correct answers: ", correctbubble1 / totalbubble1)

    bubble2 = user2[user2['graphType'] == 'bubble']
    totalbubble2 = bars2.shape[0]
    print("The total answers for bubble and user 2 is:  ", totalbubble2)

    CorrectAnswers = bubble2[bubble2["correctAnswer"] == bubble2["answer"]]
    correctbubble2 = CorrectAnswers.shape[0]
    print("The total correct answers for bubble and user 2 is:  ", correctbubble2)
    print("Percentage of correct answers: ", correctbubble2 / totalbubble2)

    area = user1[user1['graphType'] == 'area']
    totalarea1 = area.shape[0]
    print("The total answers for area and user 1 is:  ", totalarea1)

    CorrectAnswers = area[area["correctAnswer"] == area["answer"]]
    correctarea1 = CorrectAnswers.shape[0]
    print("The total correct answers for area and user 1 is:  ", correctarea1)
    print("Percentage of correct answers: ", correctarea1 / totalarea1)

    area2 = user2[user2['graphType'] == 'area']
    totalarea2 = area2.shape[0]
    print("The total answers for area and user 2 is:  ", totalarea2)

    CorrectAnswers = area[area["correctAnswer"] == area["answer"]]
    correctarea2 = CorrectAnswers.shape[0]
    print("The total correct answers for area and user 2 is:  ", correctarea2)
    print("Percentage of correct answers: ", correctarea2 / totalarea2)

    # display DataFrame
    # print(user1)
    # print(user2)
    # print(bars)
'''''''''
On average user 561548903 had an error of 2.3933574652824645 for the bubble graph
On average user 601668031 had an error of 4.131958339810913 for the area graph
On average user 601668031 had an error of 1.439130136412843 for the bar graph
On average user 601668031 had an error of 2.1882964938641565 for the bubble graph
On average user 626063024 had an error of 2.9944128261231375 for the area graph
On average user 626063024 had an error of 2.1421884087182685 for the bar graph
On average user 626063024 had an error of 3.866078710768898 for the bubble graph
On average user 637387854 had an error of 1.5624089205723748 for the area graph
On average user 637387854 had an error of -0.09165054115199282 for the bar graph
On average user 637387854 had an error of 2.8628346334493884 for the bubble graph
On average user 669187621 had an error of 4.620647361848339 for the area graph
On average user 669187621 had an error of 1.6120196666672848 for the bar graph
On average user 669187621 had an error of 2.557243924228237 for the bubble graph
On average user 697610459 had an error of 3.560756884813734 for the area graph
On average user 697610459 had an error of 0.1503577238626806 for the bar graph
On average user 697610459 had an error of 2.632301768745571 for the bubble graph
On average user 717162914 had an error of 2.304460793731465 for the area graph
On average user 717162914 had an error of 0.7552288577016684 for the bar graph
On average user 717162914 had an error of 0.6436338484892892 for the bubble graph
On average user 746865556 had an error of 3.5120246963614634 for the area graph
On average user 746865556 had an error of 1.050792903459094 for the bar graph
On average user 746865556 had an error of 2.6949560456702186 for the bubble graph
On average user 793347286 had an error of 4.102990360972003 for the area graph
On average user 793347286 had an error of 4.475647427976571 for the bar graph
On average user 793347286 had an error of 3.600001713543286 for the bubble graph
On average user 907089079 had an error of 3.6871049453273885 for the area graph
On average user 907089079 had an error of 0.6627072269018752 for the bar graph
On average user 907089079 had an error of 2.5832489947460817 for the bubble graph
On average user 946303072 had an error of 3.9019006956624156 for the area graph
On average user 946303072 had an error of 1.305871351343024 for the bar graph
On average user 946303072 had an error of 2.242367589987284 for the bubble graph
On average user 970368162 had an error of 4.113119485995787 for the area graph
On average user 970368162 had an error of 2.282507262415779 for the bar graph
On average user 970368162 had an error of 4.095972958342351 for the bubble graph
On average user 988855526 had an error of 3.8603658776003775 for the area graph
On average user 988855526 had an error of 1.8001287237939505 for the bar graph
On average user 988855526 had an error of 2.8001715978209467 for the bubble graph
Bar graph error for no reporting:  (1.126405463555971, 0.264317618469363)
Area graph error for no reporting:  (3.7655761530714513, 0.2844122047875867)
Bubble graph error for no reporting:  (2.475787069045061, 0.24999594824548915)
Bar graph error with reporting:  (1.6054321229135429, 0.2901310352413627)
Area graph error with reporting:  (3.195102334026163, 0.2957386671466518)
Bubble graph error with reporting:  (2.7329638540851517, 0.2727774280040578)
The total answers for bars and user 1 is:   252
The total correct answers for bars and user 1 is:   39
Percentage of correct answers:  0.15476190476190477
The total answers for bars and user 2 is:   252
The total correct answers for bars and user 2 is:   34
Percentage of correct answers:  0.1349206349206349
The total answers for bubble and user 1 is:   252
The total correct answers for bubble and user 1 is:   20
Percentage of correct answers:  0.07936507936507936
The total answers for bubble and user 2 is:   252
The total correct answers for bubble and user 2 is:   21
Percentage of correct answers:  0.08333333333333333
The total answers for area and user 1 is:   252
The total correct answers for area and user 1 is:   15
Percentage of correct answers:  0.05952380952380952
The total answers for area and user 2 is:   252
The total correct answers for area and user 2 is:   15
Percentage of correct answers:  0.05952380952380952
'''''''''

if __name__ == '__main__':
    process()


''''''''''''