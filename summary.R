library(ggplot2)
library(dplyr)
file <- 'C:/Users/19292/Documents/GitHub/a3-experiment/error.csv'
d <- read.csv(file)
d
class(d)

# Orientation follows the discrete axis
ggplot(d,aes(x=error,y=type)) +
  geom_point() +
  stat_summary( fun.data = "mean_cl_boot",colour = "Blue", size = 1,minx =0)

# Orientation follows the discrete axis
ggplot(mtcars, aes(mpg, factor(cyl))) +
  geom_point() +
  stat_summary(fun.data = "mean_cl_boot", colour = "red", size = 2)

