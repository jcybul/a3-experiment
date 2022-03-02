library(ggplot2)
library(dplyr)
file <- 'C:/Users/19292/Documents/GitHub/a3-experiment/error.csv'
d <- read.csv(file)
d
class(d)
d <- sort (d, decreasing = FALSE)
d
# Orientation follows the discrete axis
ggplot(d,aes(x=error,y=type)) +
  geom_point(alpha=0.6) + xlim(0, 6) +
  stat_summary( fun.data = "mean_cl_boot",colour = "Blue", size = 1)
