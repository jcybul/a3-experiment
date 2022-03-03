library(ggplot2)
library(dplyr)
file <- 'C:/Users/19292/Documents/GitHub/a3-experiment/error.csv'
d <- read.csv(file)
d
class(d)

# Orientation follows the discrete axis
ggplot(d,aes(x=error,y=type)) +
  geom_point(alpha=0.2) + coord_cartesian(xlim=c(0, 7)) +ggtitle("95% confidence interval for mean bootstrap based on chart type and feedback")+
  stat_summary( fun.data = "mean_cl_boot",colour = "Blue", size = 1,fun.args=list(conf.int=.95)
)

stat_sum_df <- function(fun, geom="crossbar", ...) {
  stat_summary(fun.data = fun, colour = "blue", geom = geom, width = 0.2, ...)
}
p <- ggplot(d,aes(x=error,y=type)) + geom_point(alpha=0.2) + coord_cartesian(xlim=c(0, 7)) +ggtitle("95% confidence interval for mean bootstrap based on chart type and feedback")
# The crossbar geom needs grouping to be specified when used with
# a continuous x axis.
p + stat_sum_df("mean_cl_boot", mapping = aes(group = type))

