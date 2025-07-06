import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const trafficData = [
  { name: 'Jan', visits: 4000 },
  { name: 'Feb', visits: 3000 },
  { name: 'Mar', visits: 5000 },
  { name: 'Apr', visits: 4500 },
  { name: 'May', visits: 6000 },
  { name: 'Jun', visits: 5500 },
];

const signupData = [
  { name: 'Week 1', signups: 20 },
  { name: 'Week 2', signups: 45 },
  { name: 'Week 3', signups: 30 },
  { name: 'Week 4', signups: 50 },
];

const mostWatchedFilms = [
  { title: 'The Great Escape', views: 1204 },
  { title: 'Chasing Dreams', views: 987 },
  { title: 'City Lights', views: 854 },
  { title: 'Another Dawn', views: 765 },
  { title: 'The Final Cut', views: 654 },
];

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-secondary/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>Weekly site visits for the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Signups</CardTitle>
                  <CardDescription>New user registrations per week.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={signupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="signups" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Watched Films</CardTitle>
                  <CardDescription>All-time most viewed films on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mostWatchedFilms.map((film) => (
                        <TableRow key={film.title}>
                          <TableCell className="font-medium">{film.title}</TableCell>
                          <TableCell className="text-right">{film.views}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Technical Insights</CardTitle>
                        <CardDescription>Browser and device usage statistics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Technical insight charts coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Geographic Data</CardTitle>
                        <CardDescription>User distribution by country.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Geographic map coming soon.</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;