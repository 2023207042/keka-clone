import { useState } from 'react';
import { RNButton } from '@/components/RNButton';
import { RNInput } from '@/components/RNInput';
import { RNBatchInput } from '@/components/RNBatchInput';
import { RNCard } from '@/components/RNCard';
import { RNBadge } from '@/components/RNBadge';
import { RNSelect } from '@/components/RNSelect';
import { RNTextarea } from '@/components/RNTextarea';
import { RNSwitch } from '@/components/RNSwitch';
import { RNAlert } from '@/components/RNAlert';
import { RNModal } from '@/components/RNModal';
import { RNTable, type ColumnDef } from '@/components/RNTable';
import { RNTabs } from '@/components/RNTabs';
import { RNAccordion } from '@/components/RNAccordion';
import { RNTag } from '@/components/RNTag';
import { RNAvatar } from '@/components/RNAvatar';
import { RNBreadCrumb } from '@/components/RNBreadCrumb';
import { RNQuote } from '@/components/RNQuote';
import { RNToast } from '@/components/RNToast';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { RNLabel } from '@/components/RNLabel';
import { RNSeparator } from '@/components/RNSeparator';
import { RNCheckbox } from '@/components/RNCheckbox';
import { RNRadioGroup, RNRadioItem } from '@/components/RNRadioGroup';
import { RNSlider } from '@/components/RNSlider';
import { RNProgress } from '@/components/RNProgress';
import { RNSkeleton } from '@/components/RNSkeleton';
import { RNDropdownMenu } from '@/components/RNDropdownMenu';
import { RNDrawer } from '@/components/RNDrawer';
import { RNDatePicker } from '@/components/RNDatePicker';
import { RNDateRangePicker } from '@/components/RNDateRangePicker';
import { RNCarousel } from '@/components/RNCarousel';
import { RNCombobox } from '@/components/RNCombobox';
import { Mail, Key, Layers, Eye, MoreHorizontal, Settings, User, LogOut } from 'lucide-react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import type { DateRange } from 'react-day-picker';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "appName": "Component Lib" } }
  },
  lng: "en",
  fallbackLng: "en",
});

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
}

function App() {
  const [tags, setTags] = useState<string[]>(['React', 'Tailwind', 'Boilerplate']);
  const [switchState, setSwitchState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // New Component States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [sliderVal, setSliderVal] = useState(50);
  const [radioVal, setRadioVal] = useState('option1');
  const [checkVal, setCheckVal] = useState(false);
  const [comboVal, setComboVal] = useState('');

  // Generate Dummy Data for Pagination Test
  const users: User[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : 'User',
    status: i % 4 === 0 ? 'inactive' : i % 2 === 0 ? 'active' : 'pending',
  }));

  const columns: ColumnDef<User>[] = [
    { header: 'ID', accessorKey: 'id', sortable: true, className: 'w-[50px]' },
    { 
      header: 'Avatar', 
      className: 'w-[50px]',
      cell: () => <RNAvatar size="sm" />
    },
    { header: 'Name', accessorKey: 'name', sortable: true },
    { header: 'Email', accessorKey: 'email', sortable: true },
    { 
      header: 'Role', 
      accessorKey: 'role',
      cell: (user) => (
        <RNBadge variant={user.role === 'Admin' ? 'outline' : 'warning'}>{user.role}</RNBadge>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (user) => (
        <RNBadge variant={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'destructive' : 'warning'}>
          {user.status}
        </RNBadge>
      )
    },
    {
      header: 'Actions',
      className: 'w-[50px]',
      cell: () => (
        <RNDropdownMenu 
          trigger={
             <RNButton variant="ghost" size="icon" className="h-8 w-8">
               <MoreHorizontal className="h-4 w-4 text-[var(--text-secondary)]"/>
             </RNButton>
          }
          items={[
            { label: 'View Details', icon: <Eye size={14}/>, onClick: () => alert('View Clicked') },
            { label: 'Edit User', icon: <Settings size={14}/> },
            { label: 'Delete', icon: <LogOut size={14}/>, danger: true },
          ]}
          align="right"
        />
      )
    }
  ];

  const showSuccessToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans transition-colors duration-300 pb-20">
        <div className="max-w-6xl mx-auto p-8 space-y-12">
          
          <div className="flex justify-end items-center gap-4">
            <RNDropdownMenu 
                trigger={
                   <RNAvatar size="sm" alt="User Profile" />
                }
                items={[
                    { label: 'Profile', icon: <User size={14}/> },
                    { label: 'Settings', icon: <Settings size={14}/> },
                    { label: 'Logout', icon: <LogOut size={14}/>, danger: true }
                ]}
                align="right"
            />
            <ThemeSwitcher />
          </div>

          <div className="text-center space-y-4">
             <div className="flex justify-center mb-4">
               <RNBreadCrumb items={[{ label: 'Components', href: '#' }, { label: 'Showcase', active: true }]} />
             </div>
             <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] bg-clip-text text-transparent">
              Premium Boilerplate
            </h1>
            <p className="text-[var(--text-secondary)] text-xl">
              Scalable, Themed, Production-Ready.
            </p>
          </div>

          <RNCard variant="elevated" padding="lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Layers className="h-6 w-6 text-[var(--color-primary-500)]"/>
              Components Showcase
            </h2>
            
            <RNTabs 
              className="mt-6"
              tabs={[
                {
                  id: 'forms',
                  label: 'Form Elements',
                  content: (
                    <div className="space-y-6 pt-6 animate-in slide-in-from-left-4 fade-in duration-300">
                       <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <RNInput label="Email" placeholder="user@example.com" leftIcon={<Mail className="w-4 h-4"/>}/>
                           <RNSelect 
                             label="Role" 
                             options={[
                               { label: 'Admin', value: 'admin' },
                               { label: 'User', value: 'user' },
                               { label: 'Guest', value: 'guest' }
                             ]}
                           />
                           <div className="flex gap-6 items-center pt-2">
                              <RNSwitch 
                                label="Notifications" 
                                checked={switchState} 
                                onCheckedChange={setSwitchState}
                              />
                               <RNCheckbox 
                                 label="Terms Agreed" 
                                 checked={checkVal}
                                 onChange={(e) => setCheckVal(e.target.checked)}
                               />
                           </div>
                        </div>
                        <div className="space-y-4">
                          <RNInput label="Password" type="password" showPasswordToggle leftIcon={<Key className="w-4 h-4"/>}/>
                          <RNTextarea label="Bio" placeholder="Tell us about yourself..." />
                          <div className="pt-2">
                               <RNLabel label="Preferences" variant="p2" className="mb-2 block"/>
                               <RNRadioGroup value={radioVal} onValueChange={setRadioVal}>
                                   <RNRadioItem value="option1" label="Email Updates" />
                                   <RNRadioItem value="option2" label="SMS Updates" />
                               </RNRadioGroup>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 grid md:grid-cols-2 gap-6">
                        <div>
                           <h4 className="text-sm font-semibold mb-2">Combobox (Searchable)</h4>
                           <RNCombobox 
                               items={[
                                   { label: 'React', value: 'react' },
                                   { label: 'Vue', value: 'vue' },
                                   { label: 'Angular', value: 'angular' },
                                   { label: 'Svelte', value: 'svelte' },
                                   { label: 'Next.js', value: 'nextjs' },
                               ]}
                               value={comboVal}
                               onSelect={setComboVal}
                               placeholder="Select Framework"
                           />
                        </div>
                         <div>
                            <h4 className="text-sm font-semibold mb-2">Batch Input</h4>
                            <RNBatchInput 
                            label="Technologies"
                            value={tags}
                            onChange={setTags}
                            placeholder="Type and press Enter..."
                            helperText="Press enter to add tags"
                          />
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'data',
                  label: 'Data Display',
                  content: (
                    <div className="space-y-6 pt-6 animate-in slide-in-from-right-4 fade-in duration-300">
                      <RNTable 
                        data={users}
                        columns={columns}
                        caption="User Management List (Client-Side Pagination & Sorting)"
                        pageSize={5}
                      />
                    </div>
                  )
                },
                {
                  id: 'feedback',
                  label: 'Feedback & UI',
                  content: (
                    <div className="space-y-6 pt-6 animate-in zoom-in-95 fade-in duration-300">
                       <div className="grid gap-4">
                        <RNAlert title="Success" variant="success">Your changes have been saved successfully.</RNAlert>
                        <RNAlert title="Note" variant="info" dismissible>This is an informational alert that you can dismiss.</RNAlert>
                        <div className="flex gap-4 items-center">
                          <RNButton onClick={() => setModalOpen(true)}>Open Modal</RNButton>
                          <RNButton variant="outline" onClick={() => setDrawerOpen(true)}>Open Drawer</RNButton>
                          <RNButton variant="ghost" onClick={showSuccessToast}>Show Toast</RNButton>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 mt-4">
                           <div>
                              <h4 className="text-sm font-bold mb-2">Accordion</h4>
                              <RNAccordion 
                                items={[
                                  { title: 'What is this?', content: 'This is a premium component library.' },
                                  { title: 'How do I use it?', content: 'Simply import components and use them!' }
                                ]}
                              />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold mb-2">Quote & Tags</h4>
                              <RNQuote author="Steve Jobs" role="CEO, Apple">
                                Design is not just what it looks like and feels like. Design is how it works.
                              </RNQuote>
                              <div className="mt-4 flex gap-2">
                                <RNTag variant="primary">Design</RNTag>
                                <RNTag variant="secondary">Development</RNTag>
                                <RNTag variant="outline">React</RNTag>
                              </div>
                           </div>
                        </div>

                      </div>
                    </div>
                  )
                },
                {
                  id: 'lab',
                  label: 'New Components (Lab)',
                  content: (
                     <div className="space-y-8 pt-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="grid md:grid-cols-2 gap-8">
                             <RNCard className="relative z-10">
                                 <h3 className="font-bold mb-4">Date Pickers</h3>
                                 <div className="space-y-4">
                                     <div>
                                         <RNLabel label="Single Date" variant="p3Bold" className="mb-1 block" />
                                         <RNDatePicker selected={date} onSelect={setDate} />
                                     </div>
                                     <div>
                                         <RNLabel label="Date Range" variant="p3Bold" className="mb-1 block" />
                                         <RNDateRangePicker selected={dateRange} onSelect={setDateRange} />
                                     </div>
                                 </div>
                             </RNCard>

                             <RNCard>
                                 <h3 className="font-bold mb-4">Progress & Skeletons</h3>
                                 <div className="space-y-6">
                                     <div className="space-y-2">
                                         <RNLabel label="Loading Progress" variant="p3" />
                                         <RNProgress value={sliderVal} />
                                     </div>
                                     <div className="space-y-2">
                                         <RNLabel label="Skeleton Loading" variant="p3" />
                                         <div className="flex items-center space-x-4">
                                             <RNSkeleton className="h-12 w-12" circle />
                                             <div className="space-y-2 flex-1">
                                                 <RNSkeleton className="h-4 w-full" />
                                                 <RNSkeleton className="h-4 w-3/4" />
                                             </div>
                                         </div>
                                     </div>
                                      <div className="space-y-2">
                                         <RNLabel label={`Slider Value: ${sliderVal}`} variant="p3" />
                                         <RNSlider value={sliderVal} onChange={(e) => setSliderVal(parseInt(e.target.value))} />
                                     </div>
                                 </div>
                             </RNCard>
                        </div>
                        
                        <RNCard>
                            <h3 className="font-bold mb-4">Carousel</h3>
                            <RNCarousel>
                                <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 1</div>
                                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 2</div>
                                <div className="h-48 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">Slide 3</div>
                            </RNCarousel>
                        </RNCard>
                     </div>
                  )
                }
              ]} 
            />

          </RNCard>

          <RNModal 
            open={modalOpen} 
            onClose={() => setModalOpen(false)}
            title="Example Modal"
            footer={
              <>
                <RNButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</RNButton>
                <RNButton onClick={() => setModalOpen(false)}>Confirm</RNButton>
              </>
            }
          >
            <div className="space-y-4">
              <p>This is a modal utilizing the new premium design system. It features smooth animations and a clean layout.</p>
              <RNAlert variant="warning" title="Warning">
                Modals should be used sparingly for important interruptions.
              </RNAlert>
            </div>
          </RNModal>
          
          <RNDrawer
             open={drawerOpen}
             onClose={() => setDrawerOpen(false)}
             title="App Settings"
             description="Manage your application preferences here."
             footer={
                 <RNButton onClick={() => setDrawerOpen(false)}>Save Changes</RNButton>
             }
          >
              <div className="space-y-6 py-4">
                   <RNSwitch label="Enable Dark Mode" checked={false} />
                   <RNSwitch label="Email Notifications" checked={true} />
                   <RNSeparator />
                   <RNSelect label="Language" options={[{label: 'English', value: 'en'}, {label: 'Spanish', value: 'es'}]} />
              </div>
          </RNDrawer>

          <RNToast 
            message="Operation completed successfully!" 
            isVisible={showToast} 
            variant="success"
            onClose={() => setShowToast(false)}
          />

        </div>
      </div>
    </I18nextProvider>
  );
}

export default App;
