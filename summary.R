library(ggplot2)
library(dplyr)
file <- 'C:/Users/19292/Documents/GitHub/a3-experiment/error.csv'
d <- read.csv(file)
d
class(d)

# Orientation follows the discrete axis
ggplot(d,aes(x=error,y=factor(type))) +
  stat_summary(data=d, fun.data = "mean_cl_boot",colour = "red", size = 0.5,geom = "pointrange")

# Orientation follows the discrete axis
ggplot(mtcars, aes(mpg, factor(cyl))) +
  geom_point() +
  stat_summary(fun.data = "mean_cl_boot", colour = "red", size = 2)
