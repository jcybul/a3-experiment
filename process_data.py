import pandas as pd


def process():
    # read csv file
    data = pd.read_csv("data.csv")
    user1 = data[data['userId'] % 2 == 1]
    user2 = data[data['userId'] % 2 == 0]

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


if __name__ == '__main__':
    process()
